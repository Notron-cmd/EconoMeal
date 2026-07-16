import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const expenses = new Hono<{ Variables: Variables }>()

expenses.use("*", authMiddleware)

const expenseSchema = z.object({
  amount: z.number().positive(),
  name: z.string().optional(),
  meal_type: z.enum(["breakfast", "lunch", "dinner", "snack", "grocery", "other"]),
  note: z.string().optional(),
})

expenses.get("/", async (c) => {
  const user = c.get("user")

  const { data } = await supabase
    .from("expense_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(50)

  return c.json(data ?? [])
})

expenses.post("/", zValidator("json", expenseSchema), async (c) => {
  const user = c.get("user")
  const body = c.req.valid("json")

  const { data, error } = await supabase
    .from("expense_logs")
    .insert({
      user_id: user.id,
      amount: body.amount,
      name: body.name,
      meal_type: body.meal_type,
      note: body.note,
    })
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 400)
  return c.json(data)
})

expenses.delete("/:id", async (c) => {
  const user = c.get("user")
  const id = c.req.param("id")

  const { error } = await supabase
    .from("expense_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return c.json({ error: error.message }, 400)
  return c.json({ success: true })
})

export default expenses
