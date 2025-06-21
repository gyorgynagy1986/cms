import { createClient } from "@/lib/supabase/server"
import type { Post } from "@/lib/types"
import PostsPageClient from "./posts-page-client" // Importáljuk az új kliens komponenst

export default async function PostsPage({ searchParams }: { searchParams?: { q?: string } }) {
  const supabase = await createClient()
  const searchTerm = searchParams?.q || ""

  let query = supabase
    .from("posts")
    .select(
      `
      id,
      created_at,
      last_modified,
      author_id,
      title,
      excerpt,
      image,
      status,
      views,
      comments_count,
      likes,
      read_time,
      category,
      tags,
      featured,
      seo_score,
      profiles (
        name,
        avatar_url
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (searchTerm) {
    // Keresés a címben VAGY a szerző nevében (ha a profiles joinolt)
    // A Supabase full-text search lenne itt a legjobb, de egy egyszerű ilike is megteszi most.
    // Mivel a profiles joinolt, a where nem fog működni közvetlenül a profiles.name-re.
    // Ezt a szűrést a kliens oldalon kellene finomítani, vagy egy adatbázis view/függvény segítségével.
    // Most a címre szűrünk szerver oldalon.
    query = query.ilike("title", `%${searchTerm}%`)
    // A szerzőre való szűrést a PostsPageClient kezeli a kapott adatokon.
  }

  const { data: posts, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    // Ideiglenesen üres tömböt adunk vissza hiba esetén, vagy egy hiba komponenst jeleníthetünk meg
    return <PostsPageClient initialPosts={[]} initialSearchTerm={searchTerm} />
  }

  // Bejelentkezett felhasználó profiljának lekérdezése az alapértelmezett szerzőhöz
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let currentUserProfile = null
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", user.id)
      .single()
    currentUserProfile = profileData
  }

  return (
    <PostsPageClient
      initialPosts={
        posts
          ? (posts.map((post: any) => ({
              ...post,
              profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles,
            })) as Post[])
          : []
      }
      initialSearchTerm={searchTerm}
      currentUserProfile={currentUserProfile}
    />
  )
}
