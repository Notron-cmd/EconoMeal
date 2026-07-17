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

expenses.get("/weekly", async (c) => {
  const user = c.get("user")

  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split("T")[0])
  }

  const { data: rows } = await supabase
    .from("daily_spending")
    .select("date, total_spent")
    .eq("user_id", user.id)
    .gte("date", dates[0])
    .lte("date", dates[6])

  const spendMap: Record<string, number> = {}
  if (rows) {
    for (const r of rows) {
      spendMap[r.date] = Number(r.total_spent)
    }
  }

  const days = dates.map((date) => ({
    date,
    total_spent: spendMap[date] ?? 0,
  }))

  return c.json({ days })
})

expenses.get("/streak", async (c) => {
  const user = c.get("user")

  // Get daily budget
  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const finRes = await fetch(
    `${supabaseUrl}/rest/v1/user_finances?user_id=eq.${user.id}&select=uang_bulanan`,
    { headers: { "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` } }
  )
  const finRows = (await finRes.json()) as { uang_bulanan?: number }[]
  const anggaran = Number(finRows?.[0]?.uang_bulanan ?? 0)
  const dailyBudget = Math.floor(anggaran / 30 / 1000) * 1000

  // Get last 60 days of spending
  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
  const startDate = sixtyDaysAgo.toISOString().split("T")[0]

  const { data: rows } = await supabase
    .from("daily_spending")
    .select("date, total_spent")
    .eq("user_id", user.id)
    .gte("date", startDate)
    .order("date", { ascending: false })

  const spendMap: Record<string, number> = {}
  if (rows) {
    for (const r of rows) {
      spendMap[r.date] = Number(r.total_spent)
    }
  }

  // Count consecutive days backwards from today
  let streak = 0
  const checkDate = new Date()
  let first = true

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0]
    const hasRecord = dateStr in spendMap
    const spent = hasRecord ? spendMap[dateStr] : 0

    // Today always counts (spent defaults to 0 if no record)
    // Past days only count if there's a spending record
    if (!hasRecord && !first) break
    if (spent > dailyBudget) break

    streak++
    first = false
    checkDate.setDate(checkDate.getDate() - 1)
    if (streak > 365) break
  }

  return c.json({ streak, daily_budget: dailyBudget })
})

export default expenses
