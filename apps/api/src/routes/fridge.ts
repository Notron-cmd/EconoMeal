import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const fridge = new Hono<{ Variables: Variables }>()

fridge.use("*", authMiddleware)

const saveIngredientsSchema = z.object({
  ingredients: z.array(z.string()).min(1),
})

fridge.post("/save", zValidator("json", saveIngredientsSchema), async (c) => {
  const user = c.get("user")
  const body = c.req.valid("json")

  const { data, error } = await supabase
    .from("profiles")
    .update({ pantry_staples: body.ingredients })
    .eq("id", user.id)
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 400)
  return c.json(data)
})

fridge.get("/suggestions", async (c) => {
  const user = c.get("user")

  const { data: profile } = await supabase
    .from("profiles")
    .select("pantry_staples")
    .eq("id", user.id)
    .single()

  const ingredients = profile?.pantry_staples ?? []

  const { data: prices } = await supabase
    .from("regional_prices")
    .select("*")
    .in("nama_bahan", ingredients)

  return c.json({
    ingredients,
    estimated_costs: prices ?? [],
  })
})

export default fridge
