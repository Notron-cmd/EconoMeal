import https from "node:https"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const PIHPS_BASE = "https://www.bi.go.id/hargapangan"

const agent = new https.Agent({ rejectUnauthorized: false })

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const COMMODITY_MAP: Record<string, string> = {
  "Beras": "Beras",
  "Daging Ayam": "Daging Ayam",
  "Daging Sapi": "Daging Sapi",
  "Telur Ayam": "Telur Ayam",
  "Bawang Merah": "Bawang Merah",
  "Bawang Putih": "Bawang Putih",
  "Cabai Merah": "Cabai Merah",
  "Cabai Rawit": "Cabai Rawit",
  "Minyak Goreng": "Minyak Goreng",
  "Gula Pasir": "Gula Pasir",
}

async function fetchPIHPS(endpoint: string, params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`${PIHPS_BASE}${endpoint}?${qs}`, { agent })
  if (!res.ok) throw new Error(`PIHPS ${endpoint} failed: ${res.status}`)
  const json = await res.json()
  return json.data
}

function parsePrice(raw: string): number {
  return Number(raw.replace(/\./g, "").replace(/,/g, ""))
}

async function sync() {
  console.log("Fetching provinces...")
  const provinces: { id: number; name: string }[] = await fetchPIHPS("/WebSite/TabelHarga/GetRefProvince", {})

  const today = new Date()
  const endDate = today.toISOString().split("T")[0]
  const startDate = new Date(today.getTime() - 14 * 86400000).toISOString().split("T")[0]

  let total = 0

  for (const prov of provinces) {
    const params: Record<string, string> = {
      price_type_id: "1",
      province_id: String(prov.id),
      comcat_id: "",
      regency_id: "",
      tipe_laporan: "1",
      start_date: startDate,
      end_date: endDate,
    }

    try {
      const rows: any[] = await fetchPIHPS("/WebSite/TabelHarga/GetGridDataDaerah", params)

      const latestPerCommodity = new Map<string, number>()

      for (const row of rows) {
        if (row.level !== 1) continue
        const commodity = COMMODITY_MAP[row.name]
        if (!commodity) continue

        const dates = Object.keys(row).filter((k) => /^\d/.test(k))
        const latestDate = dates.sort().reverse()[0]
        if (!latestDate) continue

        latestPerCommodity.set(commodity, parsePrice(row[latestDate]))
      }

      for (const [nama_bahan, price] of latestPerCommodity) {
        const { error } = await supabase.from("regional_prices").upsert(
          {
            nama_bahan,
            wilayah: prov.name,
            estimasi_harga: price,
            satuan: "kg",
          },
          { onConflict: "nama_bahan,wilayah" }
        )
        if (error) console.error(`  Error upserting ${nama_bahan} ${prov.name}:`, error.message)
      }

      total += latestPerCommodity.size
      console.log(`  ${prov.name}: ${latestPerCommodity.size} commodities`)
    } catch (err) {
      console.error(`  ${prov.name}: failed -`, (err as Error).message)
    }
  }

  console.log(`\nDone! Synced ${total} prices across ${provinces.length} provinces.`)
}

sync().catch(console.error)
