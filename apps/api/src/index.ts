import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { secureHeaders } from "hono/secure-headers"
import { serve } from "@hono/node-server"
import authRoutes from "./routes/auth"
import financesRoutes from "./routes/finances"
import fridgeRoutes from "./routes/fridge"
import recipesRoutes from "./routes/recipes"
import streaksRoutes from "./routes/streaks"
import pricesRoutes from "./routes/prices"
import aiRoutes from "./routes/ai"
import nutritionRoutes from "./routes/nutrition"
import type { Variables } from "./lib/types"

const app = new Hono<{ Variables: Variables }>()

app.use("*", cors())
app.use("*", logger())
app.use("*", secureHeaders())

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.route("/api/auth", authRoutes)
app.route("/api/finances", financesRoutes)
app.route("/api/fridge", fridgeRoutes)
app.route("/api/recipes", recipesRoutes)
app.route("/api/streaks", streaksRoutes)
app.route("/api/prices", pricesRoutes)
app.route("/api/ai", aiRoutes)
app.route("/api/nutrition", nutritionRoutes)

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001

console.log(`API server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})

export default app
