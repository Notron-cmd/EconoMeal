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

auth.post("/register", async (c) => {
  const { email, password, name } = await c.req.json()

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400)
  }

  const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: name || email.split("@")[0] },
  })

  if (signUpError) return c.json({ error: signUpError.message }, 400)
  if (!authData.user) return c.json({ error: "Failed to create user" }, 500)

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: authData.user.id,
    name: name || email.split("@")[0],
  })
  if (profileError) console.error("Profile creation error:", profileError.message)

  const { data: loginData } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return c.json({
    user: authData.user,
    session: loginData?.session ?? null,
  })
})

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json()

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400)
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return c.json({ error: error.message }, 401)

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single()

  return c.json({
    user: data.user,
    session: data.session,
    profile,
  })
})

auth.put("/profile", authMiddleware, async (c) => {
  const user = c.get("user")
  const body = await c.req.json()

  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: body.name,
      kota_domisili: body.kota_domisili,
      provinsi: body.provinsi,
      pantry_staples: body.pantry_staples,
      alat_masak: body.alat_masak,
      alergi: body.alergi,
      avatar_url: body.avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 400)
  return c.json(data)
})

export default auth
