import { Hono } from "hono"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const auth = new Hono<{ Variables: Variables }>()

auth.get("/me", authMiddleware, async (c) => {
  const user = c.get("user")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return c.json({ user, profile })
})

auth.put("/profile", authMiddleware, async (c) => {
  const user = c.get("user")
  const body = await c.req.json()

  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: body.name,
      kota_domisili: body.kota_domisili,
      alat_masak: body.alat_masak,
      alergi: body.alergi,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 400)
  return c.json(data)
})

export default auth
