import { Hono } from "hono"
import { supabase } from "../lib/supabase"
import { authMiddleware } from "../middleware/auth"
import type { Variables } from "../lib/types"

const streaks = new Hono<{ Variables: Variables }>()

streaks.use("*", authMiddleware)

streaks.get("/", async (c) => {
  const user = c.get("user")

  let { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!streak) {
    streak = { current_streak: 0, longest_streak: 0, last_active_date: null }
  }

  return c.json(streak)
})

streaks.get("/tips", async (c) => {
  const { data: tips } = await supabase.from("saver_tips").select("*").limit(5)

  return c.json(tips ?? [])
})

export default streaks
