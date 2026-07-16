import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const recipes = new Hono<{ Variables: Variables }>()

recipes.use("*", authMiddleware)

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
