import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error("List error:", error)
    return
  }
  console.log(`Users found: ${data?.users?.length}`)
  for (const u of data?.users ?? []) {
    const { error: delErr } = await supabase.auth.admin.deleteUser(u.id)
    if (delErr) console.error(`Failed: ${u.email} - ${delErr.message}`)
    else console.log(`Deleted: ${u.email}`)
  }
  console.log("Done.")
}

main()
