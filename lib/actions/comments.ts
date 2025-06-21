"use server"

import { createClient } from "@/lib/supabase/server"
import type { Comment } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function updateCommentStatusAction(commentId: number, status: Comment["status"]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Authentikáció szükséges." }
  }

  // TODO: Jogosultság ellenőrzés (pl. csak Admin vagy a poszt szerzője módosíthat)

  const { error } = await supabase.from("comments").update({ status }).eq("id", commentId)

  if (error) {
    console.error("Error updating comment status:", error)
    return { success: false, message: `Hiba a komment státuszának frissítésekor: ${error.message}` }
  }

  revalidatePath("/comments")
  return { success: true, message: "Komment státusza sikeresen frissítve." }
}

export async function deleteCommentAction(commentId: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Authentikáció szükséges." }
  }

  // TODO: Jogosultság ellenőrzés

  const { error } = await supabase.from("comments").delete().eq("id", commentId)

  if (error) {
    console.error("Error deleting comment:", error)
    return { success: false, message: `Hiba a komment törlésekor: ${error.message}` }
  }

  revalidatePath("/comments")
  return { success: true, message: "Komment sikeresen törölve." }
}
