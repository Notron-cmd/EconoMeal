import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceKey)

async function main() {
  const { error } = await supabase.rpc("exec_sql", {
    query: `alter table public.user_saved_recipes add column if not exists alat jsonb default '[]'::jsonb`,
  })

  if (error) {
    // rpc exec_sql might not exist - try direct SQL via REST API
    console.log("rpc failed, trying direct REST API...")
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
        "Prefer": "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        query: `alter table public.user_saved_recipes add column if not exists alat jsonb default '[]'::jsonb`,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("REST API failed:", res.status, text.slice(0, 500))
      console.log("\nPlease run this SQL in Supabase Dashboard SQL Editor:\n")
      console.log("alter table public.user_saved_recipes add column if not exists alat jsonb default '[]'::jsonb;")
    } else {
      console.log("Migration applied via REST API")
    }
    return
  }

  console.log("Migration applied successfully")
}

main().catch(console.error)
