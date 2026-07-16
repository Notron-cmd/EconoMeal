import { Hono } from "hono"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const budget = new Hono<{ Variables: Variables }>()

budget.use("*", authMiddleware)

budget.get("/weekly", async (c) => {
  const user = c.get("user")

  const { data: finance } = await supabase
    .from("user_finances")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!finance) return c.json({ error: "finances not set up" }, 400)

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: expenses } = await supabase
    .from("expense_logs")
    .select("amount, logged_at")
    .eq("user_id", user.id)
    .gte("logged_at", sevenDaysAgo)
    .order("logged_at", { ascending: true })

  const monthlyBudget =
    Number(finance.uang_bulanan) - Number(finance.pengeluaran_tetap) - Number(finance.target_tabungan)
  const weeklyBudget = Math.floor(monthlyBudget / 4 / 1000) * 1000
  const daily = Math.floor(monthlyBudget / 30 / 1000) * 1000

  const totalSpent = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) ?? 0
  const remaining = weeklyBudget - totalSpent

  return c.json({
    weekly_budget: weeklyBudget,
    total_spent: totalSpent,
    remaining: Math.max(0, remaining),
    percentage: weeklyBudget > 0 ? Math.round((totalSpent / weeklyBudget) * 100) : 0,
    daily_average: daily,
    expenses: expenses ?? [],
  })
})

budget.get("/monthly", async (c) => {
  const user = c.get("user")

  const { data: finance } = await supabase
    .from("user_finances")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!finance) return c.json({ error: "finances not set up" }, 400)

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: expenses } = await supabase
    .from("expense_logs")
    .select("amount")
    .eq("user_id", user.id)
    .gte("logged_at", startOfMonth.toISOString())

  const totalSpent = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) ?? 0
  const monthlyBudget = Math.floor(
    (Number(finance.uang_bulanan) - Number(finance.pengeluaran_tetap) - Number(finance.target_tabungan)) / 1000
  ) * 1000
  const remaining = monthlyBudget - totalSpent

  return c.json({
    monthly_budget: monthlyBudget,
    total_spent: totalSpent,
    remaining: Math.max(0, remaining),
    percentage: monthlyBudget > 0 ? Math.round((totalSpent / monthlyBudget) * 100) : 0,
    savings_goal: Number(finance.target_tabungan),
  })
})

export default budget
