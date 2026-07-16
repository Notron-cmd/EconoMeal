import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { secureHeaders } from "hono/secure-headers"
import { serve } from "@hono/node-server"
import authRoutes from "./routes/auth"
import financesRoutes from "./routes/finances"
import expensesRoutes from "./routes/expenses"
import fridgeRoutes from "./routes/fridge"
import budgetRoutes from "./routes/budget"
import recipesRoutes from "./routes/recipes"
import streaksRoutes from "./routes/streaks"
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
app.route("/api/expenses", expensesRoutes)
app.route("/api/fridge", fridgeRoutes)
app.route("/api/budget", budgetRoutes)
app.route("/api/recipes", recipesRoutes)
app.route("/api/streaks", streaksRoutes)

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001

console.log(`API server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})

export default app
