import type { Profile } from "@/lib/types"
import { createClient } from "@/lib/supabase/server"
import UsersPageClient from "./users-page-client"

export default async function UsersPage({ 
  searchParams 
}: { 
  searchParams?: Promise<{ q?: string }> 
}) {
  const supabase = await createClient()
  
  // Await searchParams
  const params = await searchParams
  const searchTerm = params?.q || ""

  let query = supabase.from("profiles").select("*").order("name", { ascending: true })

  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
  }

  const { data: profiles, error } = await query

  if (error) {
    console.error("Error fetching profiles:", error)
    return <UsersPageClient initialUsers={[]} searchTerm={searchTerm} />
  }

  return <UsersPageClient initialUsers={(profiles as Profile[]) || []} searchTerm={searchTerm} />
}