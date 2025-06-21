import { createClient } from "@/lib/supabase/server"
import type { Comment } from "@/lib/types"
import CommentsPageClient from "./comments-page-client"

export default async function CommentsPage({
  searchParams,
}: {
  searchParams?: { q?: string; status?: string }
}) {
  const supabase = await createClient()
  const searchTerm = searchParams?.q || ""
  const statusFilter = searchParams?.status || "all"

  let query = supabase
    .from("comments")
    .select(
      `
      id,
      created_at,
      content,
      status,
      profiles (
        name,
        email,
        avatar_url
      ),
      posts (
        id,
        title
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter)
  }

  if (searchTerm) {
    // Keresés a komment tartalmában, szerző nevében, vagy email címében
    // A posts.title kereséshez bonyolultabb query vagy adatbázis oldali megoldás kellene,
    // ha a joinolt táblában akarunk direktben keresni a fő query filterében.
    // Egyszerűsítésként most a komment tartalmára, szerző nevére/emailjére szűrünk.
    // A post title szerinti szűrést a kliens oldalon lehetne finomítani, ha szükséges.
    query = query.or(
      `content.ilike.%${searchTerm}%,profiles.name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%`,
    )
  }

  const { data: comments, error } = await query

  if (error) {
    console.error("Error fetching comments:", error)
    return (
      <CommentsPageClient
        initialComments={[]}
        searchTerm={searchTerm}
        currentStatusFilter={statusFilter as Comment["status"] | "all"}
      />
    )
  }

  return (
    <CommentsPageClient
      initialComments={
        Array.isArray(comments)
          ? comments.map((c: any) => ({
              id: c.id,
              created_at: c.created_at,
              content: c.content,
              status: c.status,
              profiles: c.profiles,
              posts: c.posts,
              author_id: c.author_id ?? null,
              post_id: c.post_id ?? null,
              ip_address: c.ip_address ?? "",
              user_agent: c.user_agent ?? "",
            }))
          : []
      }
      searchTerm={searchTerm}
      currentStatusFilter={statusFilter as Comment["status"] | "all"}
    />
  )
}
