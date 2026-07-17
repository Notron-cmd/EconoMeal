import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const nutrition = new Hono<{ Variables: Variables }>()

nutrition.use("*", authMiddleware)

const today = () => new Date().toISOString().split("T")[0]

nutrition.get("/today", async (c) => {
  const user = c.get("user")

  const { data } = await supabase
    .from("daily_nutrition")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today())
    .maybeSingle()

  if (!data) return c.json({ kalori: 0, protein: 0, karbohidrat: 0, lemak: 0 })

  return c.json({
    kalori: Number(data.total_calories),
    protein: Number(data.total_protein),
    karbohidrat: Number(data.total_carbs),
    lemak: Number(data.total_fats),
  })
})

const saveSchema = z.object({
  kalori: z.number(),
  protein: z.number(),
  karbohidrat: z.number(),
  lemak: z.number(),
})

nutrition.post("/save", zValidator("json", saveSchema), async (c) => {
  const user = c.get("user")
  const body = c.req.valid("json")

  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Delete existing record for today, then insert (bypasses RLS with service_role key)
  await fetch(`${supabaseUrl}/rest/v1/daily_nutrition?user_id=eq.${user.id}&date=eq.${today()}`, {
    method: "DELETE",
    headers: {
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
    },
  })

  const res = await fetch(`${supabaseUrl}/rest/v1/daily_nutrition`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      user_id: user.id,
      date: today(),
      total_calories: body.kalori,
      total_protein: body.protein,
      total_carbs: body.karbohidrat,
      total_fats: body.lemak,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("Nutrition save error:", res.status, errText.slice(0, 200))
    return c.json({ error: `Failed to save (${res.status})` }, 400)
  }

  // Update streak
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
      // Already active today
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
        last_active_date: today(),
      })
      .eq("user_id", user.id)
  } else {
    await supabase.from("user_streaks").insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: today(),
    })
  }

  return c.json({ ok: true })
})

export default nutrition
