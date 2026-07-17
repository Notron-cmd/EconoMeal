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

  // Use raw fetch to bypass RLS
  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  await fetch(`${supabaseUrl}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      id: authData.user.id,
      name: name || email.split("@")[0],
    }),
  })

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

  const profileData: Record<string, unknown> = { id: user.id, updated_at: new Date().toISOString() }
  for (const key of ["name", "kota_domisili", "provinsi", "pantry_staples", "alat_masak", "alergi", "avatar_url"]) {
    if (body[key] !== undefined) profileData[key] = body[key]
  }

  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Upsert via POST with on_conflict (single request, bypasses RLS)
  const qs = `on_conflict=id`
  const res = await fetch(`${supabaseUrl}/rest/v1/profiles?${qs}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Prefer": "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(profileData),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("Profile save error:", res.status, errText.slice(0, 200))
    return c.json({ error: `Failed to save profile` }, 400)
  }

  const [saved] = await res.json()
  return c.json(saved)
})

export default auth
