import { createClient } from "@/lib/supabase/server"
import type { Review } from "@/lib/types"
import ReviewsPageClient from "./reviews-page-client"

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams?: { q?: string; status?: string }
}) {
  const supabase = await createClient()
  const searchTerm = searchParams?.q || ""
  const statusFilter = searchParams?.status || "all"

  let query = supabase
    .from("reviews")
    .select(
      `
      id,
      author_id,
      created_at,
      rating,
      title,
      content,
      product_name,
      product_id,
      status,
      profiles (
        name,
        email,
        avatar_url
      )
    `,
    )
    .order("created_at", { ascending: false })

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter)
  }

  if (searchTerm) {
    // Keresés a vélemény címében, tartalmában, szerző nevében, emailjében vagy termék nevében
    query = query.or(
      `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,profiles.name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%,product_name.ilike.%${searchTerm}%`,
    )
  }

  const { data: reviews, error } = await query

  if (error) {
    console.error("Error fetching reviews:", error)
    return (
      <ReviewsPageClient
        initialReviews={[]}
        searchTerm={searchTerm}
        currentStatusFilter={statusFilter as Review["status"] | "all"}
      />
    )
  }

  return (
    <ReviewsPageClient
      initialReviews={
        (reviews
          ? reviews.map((review: any) => ({
              ...review,
              profiles: Array.isArray(review.profiles) && review.profiles.length > 0
                ? {
                    name: review.profiles[0]?.name ?? null,
                    avatar_url: review.profiles[0]?.avatar_url ?? null,
                  }
                : { name: null, avatar_url: null },
            }))
          : []) as Review[]
      }
      searchTerm={searchTerm}
      currentStatusFilter={statusFilter as Review["status"] | "all"}
    />
  )
}
