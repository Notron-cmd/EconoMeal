import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { secureHeaders } from "hono/secure-headers"
import { serve } from "@hono/node-server"

const app = new Hono()

app.use("*", cors())
app.use("*", logger())
app.use("*", secureHeaders())

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() })
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 3001

console.log(`API server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})

export default app
