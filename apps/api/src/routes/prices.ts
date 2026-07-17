import { Hono } from "hono"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const prices = new Hono<{ Variables: Variables }>()

prices.use("*", authMiddleware)

prices.get("/provinces", async (c) => {
  const { data } = await supabase
    .from("regional_prices")
    .select("wilayah")
    .order("wilayah")

  const provinces = [...new Set(data?.map((r) => r.wilayah) ?? [])]
  return c.json(provinces)
})

prices.get("/ingredients", async (c) => {
  const province = c.req.query("provinsi")

  let query = supabase.from("regional_prices").select("*")
  if (province) {
    query = query.eq("wilayah", province)
  }
  const { data } = await query.order("nama_bahan")

  return c.json(data ?? [])
})

export default prices
