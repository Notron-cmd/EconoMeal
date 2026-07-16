import type { Context, Next } from "hono"
import { supabase } from "../lib/supabase"

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized: missing token" }, 401)
  }

  const token = authHeader.split(" ")[1]
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return c.json({ error: "Unauthorized: invalid token" }, 401)
  }

  c.set("user", data.user)
  await next()
}
