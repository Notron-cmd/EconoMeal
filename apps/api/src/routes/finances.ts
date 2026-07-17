import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const finances = new Hono<{ Variables: Variables }>()

finances.use("*", authMiddleware)

const financeSchema = z.object({
  anggaran_makan: z.number().positive(),
})

finances.get("/", async (c) => {
  const user = c.get("user")

  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const res = await fetch(
    `${supabaseUrl}/rest/v1/user_finances?user_id=eq.${user.id}&select=*`,
    { headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` } }
  )

  if (!res.ok) return c.json({})

  const rows = await res.json()
  const data = rows?.[0]
  if (!data) return c.json({})

  return c.json({
    anggaran_makan: Number(data.uang_bulanan),
  })
})

finances.post("/", zValidator("json", financeSchema), async (c) => {
  const user = c.get("user")
  const body = c.req.valid("json")

  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const res = await fetch(`${supabaseUrl}/rest/v1/user_finances?on_conflict=user_id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Prefer": "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      user_id: user.id,
      uang_bulanan: body.anggaran_makan,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("Finance save error:", res.status, errText.slice(0, 200))
    return c.json({ error: `Failed to save (${res.status})` }, 400)
  }

  const dailyBudget = Math.floor(body.anggaran_makan / 30 / 1000) * 1000

  return c.json({ anggaran_makan: body.anggaran_makan, daily_budget: dailyBudget })
})

finances.get("/daily", async (c) => {
  const user = c.get("user")

  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const res = await fetch(
    `${supabaseUrl}/rest/v1/user_finances?user_id=eq.${user.id}&select=*`,
    { headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` } }
  )

  if (!res.ok) return c.json({ daily_budget: 0, anggaran_makan: 0 })

  const rows = await res.json()
  const data = rows?.[0]
  if (!data) return c.json({ daily_budget: 0, anggaran_makan: 0 })

  const anggaran = Number(data.uang_bulanan)
  const daily = Math.floor(anggaran / 30 / 1000) * 1000

  return c.json({
    daily_budget: daily,
    anggaran_makan: anggaran,
  })
})

export default finances
