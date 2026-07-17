import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const expenses = new Hono<{ Variables: Variables }>()

expenses.use("*", authMiddleware)

const today = () => new Date().toISOString().split("T")[0]

expenses.get("/today", async (c) => {
  const user = c.get("user")

  const { data } = await supabase
    .from("daily_spending")
    .select("total_spent")
    .eq("user_id", user.id)
    .eq("date", today())
    .maybeSingle()

  return c.json({ total_spent: Number(data?.total_spent ?? 0), date: today() })
})

const logSchema = z.object({
  amount: z.number().positive(),
})

expenses.post("/log", zValidator("json", logSchema), async (c) => {
  const user = c.get("user")
  const { amount } = c.req.valid("json")

  const { data: existing } = await supabase
    .from("daily_spending")
    .select("total_spent")
    .eq("user_id", user.id)
    .eq("date", today())
    .maybeSingle()

  const currentTotal = Number(existing?.total_spent ?? 0)

  const { error } = await supabase.from("daily_spending").upsert(
    {
      user_id: user.id,
      date: today(),
      total_spent: currentTotal + amount,
    },
    { onConflict: "user_id,date" }
  )

  if (error) {
    console.error("Expense log error:", error)
    return c.json({ error: "Gagal mencatat pengeluaran" }, 400)
  }

  return c.json({ total_spent: currentTotal + amount, date: today() })
})

export default expenses
