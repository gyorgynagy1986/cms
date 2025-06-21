"use server"

import { createClient } from "@/lib/supabase/server"
import type { Review } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function updateReviewStatusAction(reviewId: number, status: Review["status"]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Authentikáció szükséges." }
  }

  // TODO: Jogosultság ellenőrzés (pl. csak Admin módosíthat)

  const { error } = await supabase.from("reviews").update({ status }).eq("id", reviewId)

  if (error) {
    console.error("Error updating review status:", error)
    return { success: false, message: `Hiba a vélemény státuszának frissítésekor: ${error.message}` }
  }

  revalidatePath("/reviews")
  return { success: true, message: "Vélemény státusza sikeresen frissítve." }
}

export async function deleteReviewAction(reviewId: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Authentikáció szükséges." }
  }

  // TODO: Jogosultság ellenőrzés

  const { error } = await supabase.from("reviews").delete().eq("id", reviewId)

  if (error) {
    console.error("Error deleting review:", error)
    return { success: false, message: `Hiba a vélemény törlésekor: ${error.message}` }
  }

  revalidatePath("/reviews")
  return { success: true, message: "Vélemény sikeresen törölve." }
}
