import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const recipes = new Hono<{ Variables: Variables }>()

recipes.use("*", authMiddleware)

// ====== Saved (user's personal recipes) – must be before /:id ======

recipes.get("/saved", async (c) => {
  const user = c.get("user")

  const { data } = await supabase
    .from("user_saved_recipes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return c.json(data ?? [])
})

const bahanDetailSchema = z.object({
  nama: z.string(),
  berat: z.number(),
  satuan: z.string(),
  estimasi_harga: z.number(),
})

const saveMenuSchema = z.object({
  nama: z.string(),
  estimasi_harga: z.number(),
  nutrisi: z.object({ kalori: z.number(), protein: z.number(), lemak: z.number(), karbohidrat: z.number() }),
  bahan_utama: z.array(bahanDetailSchema).optional().default([]),
  alat: z.array(z.string()).optional().default([]),
  cara_singkat: z.string().optional().default(""),
})

recipes.post("/saved", zValidator("json", z.object({ menu: z.array(saveMenuSchema) })), async (c) => {
  const user = c.get("user")
  const body = c.req.valid("json")

  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const { count } = await supabase
    .from("user_saved_recipes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const existingCount = count ?? 0
  const newMenus = body.menu

  if (existingCount + newMenus.length > 5) {
    const toRemove = existingCount + newMenus.length - 5
    const { data: oldest } = await supabase
      .from("user_saved_recipes")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(toRemove)

    if (oldest?.length) {
      const ids = oldest.map((r) => r.id)
      const dr = await fetch(`${supabaseUrl}/rest/v1/user_saved_recipes?id=in.(${ids.join(",")})`, {
        method: "DELETE",
        headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` },
      })
      if (!dr.ok) {
        const errText = await dr.text()
        console.error("Delete old recipes error:", dr.status, errText.slice(0, 300))
      }
    }
  }

  for (const menu of newMenus) {
    const body: Record<string, unknown> = {
      user_id: user.id,
      nama: menu.nama,
      estimasi_harga: menu.estimasi_harga,
      nutrisi: menu.nutrisi,
      bahan_utama: menu.bahan_utama,
      cara_singkat: menu.cara_singkat,
    }

    let r = await fetch(`${supabaseUrl}/rest/v1/user_saved_recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ ...body, alat: menu.alat ?? [] }),
    })

    if (!r.ok) {
      const errText = await r.text()
      // Retry without alat if column is missing in the table
      if (errText.includes("Could not find the 'alat' column")) {
        console.warn("alat column missing, retrying without it")
        r = await fetch(`${supabaseUrl}/rest/v1/user_saved_recipes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": serviceKey,
            "Authorization": `Bearer ${serviceKey}`,
          },
          body: JSON.stringify(body),
        })
      }
      if (!r.ok) {
        const errText2 = await r.text()
        console.error("Save recipe Supabase error:", r.status, errText2.slice(0, 300))
        return c.json({ error: `Gagal simpan "${menu.nama}": ${errText2.slice(0, 200)}` }, 400)
      }
    }
  }

  return c.json({ ok: true })
})

recipes.get("/saved/:id", async (c) => {
  const user = c.get("user")
  const id = c.req.param("id")

  const { data } = await supabase
    .from("user_saved_recipes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!data) return c.json({ error: "Saved recipe not found" }, 404)
  return c.json(data)
})

recipes.delete("/saved/:id", async (c) => {
  const user = c.get("user")
  const id = c.req.param("id")

  const { data: recipe, error: fetchErr } = await supabase
    .from("user_saved_recipes")
    .select("estimasi_harga")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchErr || !recipe) return c.json({ error: "Saved recipe not found" }, 404)

  // Cek apakah resep ini termasuk 2 terbaru — hanya itu yang dapat refund
  // Lakukan SEBELUM delete agar id masih ketemu di DB
  const { data: recentRecipes } = await supabase
    .from("user_saved_recipes")
    .select("id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(2)

  const isRecent = recentRecipes?.some((r) => r.id === id)

  const { error: delErr } = await supabase
    .from("user_saved_recipes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (delErr) {
    console.error("Delete recipe error:", delErr)
    return c.json({ error: "Gagal menghapus resep" }, 400)
  }

  if (!isRecent) {
    return c.json({ ok: true, refunded: false, reason: "bukan 2 resep terbaru" })
  }

  // Refund: subtract estimasi_harga from today's daily_spending
  const today = new Date().toISOString().split("T")[0]
  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const { data: spendData } = await supabase
    .from("daily_spending")
    .select("total_spent")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle()

  const currentTotal = Number(spendData?.total_spent ?? 0)
  const refunded = Math.min(currentTotal, Number(recipe.estimasi_harga))
  const newTotal = Math.max(0, currentTotal - refunded)

  await fetch(`${supabaseUrl}/rest/v1/daily_spending?user_id=eq.${user.id}&date=eq.${today}`, {
    method: "DELETE",
    headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` },
  })

  if (newTotal > 0) {
    await fetch(`${supabaseUrl}/rest/v1/daily_spending`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        user_id: user.id,
        date: today,
        total_spent: newTotal,
      }),
    })
  }

  return c.json({ ok: true, refunded: true })
})

// ====== Public recipes ======

recipes.get("/", async (c) => {
  const user = c.get("user")

  const { data: profile } = await supabase
    .from("profiles")
    .select("pantry_staples, alat_masak, provinsi")
    .eq("id", user.id)
    .single()

  let query = supabase.from("recipes").select("*")

  if (profile?.alat_masak && profile.alat_masak.length > 0) {
    const hasOven = profile.alat_masak.includes("oven")
    if (!hasOven) {
      query = query.not("equipment_needed", "cs", '{"Oven"}')
    }
  }

  const { data: recipes } = await query.limit(20).order("cost_estimate", { ascending: true })

  return c.json(recipes ?? [])
})

recipes.get("/:id", async (c) => {
  const id = c.req.param("id")

  const { data } = await supabase.from("recipes").select("*").eq("id", id).single()

  if (!data) return c.json({ error: "Recipe not found" }, 404)
  return c.json(data)
})

recipes.post("/:id/cook", async (c) => {
  const user = c.get("user")
  const id = c.req.param("id")

  const { data: recipe } = await supabase.from("recipes").select("*").eq("id", id).single()
  if (!recipe) return c.json({ error: "Recipe not found" }, 404)

  const today = new Date().toISOString().split("T")[0]

  await supabase.from("expense_logs").insert({
    user_id: user.id,
    amount: recipe.cost_estimate ?? 0,
    name: recipe.name,
    meal_type: recipe.meal_type ?? "other",
    logged_at: new Date().toISOString(),
  })

  await supabase.from("daily_nutrition").upsert({
    user_id: user.id,
    date: today,
    total_calories: recipe.nutrition?.calories ?? 0,
    total_protein: recipe.nutrition?.protein ?? 0,
    total_carbs: recipe.nutrition?.carbs ?? 0,
    total_fats: recipe.nutrition?.fats ?? 0,
  })

  const { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (streak) {
    const lastActive = new Date(streak.last_active_date)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

    let newStreak = streak.current_streak
    if (diffDays === 0) {
      // Already active today, no change
    } else if (diffDays === 1) {
      newStreak += 1
    } else {
      newStreak = 1
    }

    const longest = Math.max(newStreak, streak.longest_streak)

    await supabase
      .from("user_streaks")
      .update({
        current_streak: newStreak,
        longest_streak: longest,
        last_active_date: today,
      })
      .eq("user_id", user.id)
  } else {
    await supabase.from("user_streaks").insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: today,
    })
  }

  return c.json({ success: true })
})

export default recipes
