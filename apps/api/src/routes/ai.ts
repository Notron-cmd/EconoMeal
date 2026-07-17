import { Hono } from "hono"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const ai = new Hono<{ Variables: Variables }>()

ai.use("*", authMiddleware)

async function callAI(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://economeal.app",
        "X-Title": "EconoMeal",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    }
  )

  if (!res.ok) {
    const errBody = await res.text()
    console.error("OpenRouter API error:", res.status, errBody.slice(0, 300))
    throw new Error(`OpenRouter API error (${res.status}): ${errBody}`)
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
  return data.choices?.[0]?.message?.content ?? ""
}

ai.post("/recommend", async (c) => {
  const user = c.get("user")
  const body = await c.req.json().catch(() => ({}))
  const fridgeIngredients: string[] = body?.ingredients ?? []
  const isFridgeMode = fridgeIngredients.length > 0

  const { data: profile } = await supabase
    .from("profiles")
    .select("pantry_staples, alat_masak, alergi, provinsi")
    .eq("id", user.id)
    .single()

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return c.json({ error: "AI not configured" }, 500)

  const preferensi = []
  if (profile?.alat_masak?.length) preferensi.push(`Alat masak yang tersedia: ${profile.alat_masak.join(", ")}`)
  if (profile?.alergi?.length) preferensi.push(`Alergi: ${profile.alergi.join(", ")}`)
  const preferensiStr = preferensi.length ? `\nPreferensi: ${preferensi.join(". ")}.` : ""

  const provinsi = profile?.provinsi || "DKI Jakarta"

  if (isFridgeMode) {
    const prompt = `Kamu adalah koki rumahan Indonesia. Buat 3 variasi resep berbeda dari bahan-bahan ini: ${fridgeIngredients.join(", ")}.${preferensiStr}

Tiap resep WAJIB menggunakan SEMUA bahan yang tersedia, tetapi dengan komposisi dan gaya masak yang berbeda (misal: digoreng, ditumis, disup, dibakar, dikukus, dll).
JANGAN gunakan bahan lain di luar daftar tersebut.
HANYA gunakan alat masak yang tersedia di daftar di atas. Jangan rekomendasikan alat yang tidak tersedia.
Untuk setiap bahan, tentukan berat (gram) dan estimasi harga (Rp) secara realistis.
estimasi_harga setiap menu adalah total dari estimasi_harga semua bahan_utama-nya.
cara_singkat: jelaskan langkah demi langkah secara detail (persiapan bahan, urutan memasak, teknik, waktu, dan penyajian). minimal 5 langkah.
alat: daftar alat masak yang dibutuhkan untuk resep ini (hanya dari daftar alat yang tersedia).

Kembalikan JSON SAJA:
{
  "budget_harian": 0,
  "range_harga": "Gratis (bahan dari kulkas)",
  "menu": [
    {
      "nama": "Variasi 1 - Nama Masakan",
      "estimasi_harga": 5000,
      "nutrisi": { "kalori": 300, "protein": 15, "lemak": 10, "karbohidrat": 40 },
      "bahan_utama": [
        { "nama": "Ayam", "berat": 100, "satuan": "gram", "estimasi_harga": 3000 },
        { "nama": "Bawang Merah", "berat": 15, "satuan": "gram", "estimasi_harga": 500 }
      ],
      "alat": ["wajan", "pisau"],
      "cara_singkat": "1. Cuci dan potong semua bahan. 2. Panaskan minya. 3. Tumis bumbu hingga harum. 4. Masukkan bahan utama, masak hingga matang. 5. Angkat dan sajikan."
    }
  ]
}`

    try {
      const text = await callAI(prompt, apiKey)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) return c.json({ error: "Invalid AI response format" }, 500)
      const result = JSON.parse(jsonMatch[0])
      return c.json(result)
    } catch (err) {
      console.error("AI route error:", err)
      return c.json({ error: (err as Error).message }, 500)
    }
  }

  // ====== Normal mode (with budget) ======

  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const finRes = await fetch(
    `${supabaseUrl}/rest/v1/user_finances?user_id=eq.${user.id}&select=uang_bulanan`,
    { headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` } }
  )
  const finRows = (finRes.ok ? await finRes.json() : []) as { uang_bulanan?: number }[]
  const finance = finRows?.[0]

  if (!finance) return c.json({ error: "Budget not set" }, 400)

  const dailyBudget = Math.floor(Number(finance.uang_bulanan) / 30 / 1000) * 1000

  const today = new Date().toISOString().split("T")[0]
  const { data: spendData } = await supabase
    .from("daily_spending")
    .select("total_spent")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle()
  const spentToday = Number(spendData?.total_spent ?? 0)
  const sisaBudget = Math.max(0, dailyBudget - spentToday)

  const bahanKulkas = profile?.pantry_staples?.length
    ? `\nBahan yang tersedia di kulkas: ${profile.pantry_staples.join(", ")}.`
    : ""
  const { data: prices } = await supabase
    .from("regional_prices")
    .select("nama_bahan, estimasi_harga, satuan")
    .eq("wilayah", provinsi)
    .order("nama_bahan")

  const hargaStr = prices?.length
    ? `\n\nBerikut harga bahan pangan di ${provinsi} (sumber PIHPS):\n${prices.map((p) => `- ${p.nama_bahan}: Rp${Number(p.estimasi_harga).toLocaleString("id-ID")}/${p.satuan}`).join("\n")}`
    : ""

  const randomizer = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  const categories = ["lauk_ayam", "lauk_ikan", "lauk_tahu_tempe", "sayur", "sambal_goreng", "oseng", "kuah_bening", "kuah_santan", "gorengan", "pepes_pindang", "urap_karedok"]
  const shuffled = categories.sort(() => Math.random() - 0.5).slice(0, 5)

  // Dynamic price range based on remaining budget
  const ratio = sisaBudget / dailyBudget
  let minPct: number, maxPct: number
  if (ratio >= 0.7) {
    minPct = 0.3; maxPct = 0.6
  } else if (ratio >= 0.4) {
    minPct = 0.2; maxPct = 0.5
  } else {
    minPct = 0.15; maxPct = 0.4
  }

  const prompt = `Kamu adalah koki rumahan Indonesia. Buat 5 resep asli Indonesia.

Budget harian: Rp ${dailyBudget.toLocaleString("id-ID")}. Sisa budget hari ini: Rp ${sisaBudget.toLocaleString("id-ID")} (sudah terpakai Rp ${spentToday.toLocaleString("id-ID")}).${bahanKulkas}${preferensiStr}${hargaStr}

Randomizer: ${randomizer}
Kategori yang WAJIB dipenuhi (1 resep per kategori):
${shuffled.map((c, i) => `${i + 1}. ${c.replace(/_/g, " ")}`).join("\n")}

Contoh resep: "Sayur Bening Bayam", "Telur Balado", "Oseng Tempe", "Pepes Ikan Mas", "Sambal Goreng Kentang Ati", "Urap Sayur", "Sop Oyong", "Tumis Kacang Panjang", "Perkedel Jagung", "Semur Tahu", "Ikan Bakar Cobek", "Cah Brokoli", "Sambal Teri Kacang", "Tahu Bacem", "Pindang Tongkol", "Gudeg Jogja", "Kuluban", "Botok Tahu", "Mie Goreng Jawa", "Kering Tempe", "Bubur Ayam", "Soto Ayam", "Rawon", "Tahu Aci", "Cireng Isi", "Sate Lilit", "Rica-Rica", "Woku Belanga", "Ayam Betutu", "Bebek Goreng".
JANGAN buat "Nasi Goreng", "Tumis Kangkung", "Capcay", "Pecel Lele", "Ayam Goreng", "Orek Tempe", "Sayur Asem", "Pecel Lele".
JANGAN buat hidangan non-Indonesia.
SETIAP RESEP HARUS BERBEDA dari yang lain (jangan ada bahan utama yang sama antar resep).
HANYA gunakan alat masak yang tersedia di daftar di atas. Jangan rekomendasikan alat yang tidak tersedia.

Estimasi harga per porsi: Rp ${Math.round(sisaBudget * minPct).toLocaleString("id-ID")} - Rp ${Math.round(sisaBudget * maxPct).toLocaleString("id-ID")}, hitung dari data harga bahan. Prioritaskan resep yang totalnya tidak melebihi sisa budget hari ini.
Untuk setiap bahan_utama, tentukan berat (gram) dan estimasi_harga berdasarkan data harga regional di atas.
estimasi_harga setiap menu adalah TOTAL dari estimasi_harga semua bahan_utama-nya.

cara_singkat: jelaskan langkah demi langkah secara detail (persiapan bahan, urutan memasak, teknik, waktu, dan penyajian). minimal 5 langkah.
alat: daftar alat masak yang dibutuhkan untuk resep ini (hanya dari daftar alat yang tersedia).

Nutrisi sesuai jenis menu (realistis untuk 1 porsi).

Kembalikan JSON SAJA:
{
  "budget_harian": ${dailyBudget},
  "sisa_hari_ini": ${sisaBudget},
  "range_harga": "Rp ${Math.round(sisaBudget * minPct).toLocaleString("id-ID")} - Rp ${Math.round(sisaBudget * maxPct).toLocaleString("id-ID")}",
  "menu": [
    {
      "nama": "Nama Masakan",
      "estimasi_harga": 1000,
      "nutrisi": { "kalori": 300, "protein": 15, "lemak": 10, "karbohidrat": 40 },
      "bahan_utama": [
        { "nama": "Ayam", "berat": 100, "satuan": "gram", "estimasi_harga": 3000 },
        { "nama": "Bawang Merah", "berat": 20, "satuan": "gram", "estimasi_harga": 500 }
      ],
      "alat": ["wajan", "pisau", "kompor"],
      "cara_singkat": "1. Cuci dan potong semua bahan. 2. Panaskan minyak. 3. Tumis bumbu hingga harum. 4. Masukkan bahan utama, masak hingga matang. 5. Angkat dan sajikan."
    }
  ]
}`

  try {
    const text = await callAI(prompt, apiKey)

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return c.json({ error: "Invalid AI response format" }, 500)

    const result = JSON.parse(jsonMatch[0])
    return c.json(result)
  } catch (err) {
    console.error("AI route error:", err)
    return c.json({ error: (err as Error).message }, 500)
  }
})

export default ai
