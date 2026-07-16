import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const finances = new Hono<{ Variables: Variables }>()

finances.use("*", authMiddleware)

const financeSchema = z.object({
  uang_bulanan: z.number().positive(),
  target_tabungan: z.number().min(0).optional().default(0),
  pengeluaran_tetap: z.number().min(0).optional().default(0),
})

finances.get("/", async (c) => {
  const user = c.get("user")

  const { data } = await supabase
    .from("user_finances")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return c.json(data ?? {})
})

finances.post("/", zValidator("json", financeSchema), async (c) => {
  const user = c.get("user")
  const body = c.req.valid("json")

  const { data, error } = await supabase
    .from("user_finances")
    .upsert({
      user_id: user.id,
      uang_bulanan: body.uang_bulanan,
      target_tabungan: body.target_tabungan,
      pengeluaran_tetap: body.pengeluaran_tetap,
    })
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 400)

  const dailyBudget = (body.uang_bulanan - body.pengeluaran_tetap - body.target_tabungan) / 30

  return c.json({ ...data, daily_budget: Math.round(dailyBudget) })
})

finances.get("/daily", async (c) => {
  const user = c.get("user")

  const { data } = await supabase
    .from("user_finances")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!data) return c.json({ daily_budget: 0 })

  const daily = Math.round((data.uang_bulanan - data.pengeluaran_tetap - data.target_tabungan) / 30)

  const today = new Date().toISOString().split("T")[0]
  const { data: spentData } = await supabase
    .from("expense_logs")
    .select("amount")
    .eq("user_id", user.id)
    .gte("logged_at", today)

  const totalSpent = spentData?.reduce((sum, e) => sum + Number(e.amount), 0) ?? 0

  return c.json({
    daily_budget: daily,
    spent_today: totalSpent,
    remaining: daily - totalSpent,
    percentage: daily > 0 ? Math.round((totalSpent / daily) * 100) : 0,
  })
})

export default finances
