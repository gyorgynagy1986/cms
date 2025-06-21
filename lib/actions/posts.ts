"use server"

import { createClient } from "@/lib/supabase/server"
import type { PostFormData, Post } from "@/lib/types" // Post típust is importáljuk
import { revalidatePath } from "next/cache"

export async function addPostAction(formData: PostFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Authentikáció szükséges." }
  }

  // A PostFormData 'author' mezője a szerző neve.
  // Az 'author_id' a bejelentkezett felhasználó ID-ja lesz.
  // A 'date' mezőt a 'created_at'-ként kezelhetjük, vagy ha van külön 'publish_date' mező, akkor azt.
  // Jelenleg a 'posts' táblában nincs 'publish_date', így a 'created_at' automatikusan beállítódik.
  // Ha a form 'date' mezője egy jövőbeli publikálási dátumot jelent, azt külön kellene kezelni.
  // Egyszerűség kedvéért most a 'date' mezőt nem használjuk közvetlenül az adatbázisba íráskor,
  // a created_at automatikusan generálódik.
  const newPostDbData = {
    author_id: user.id,
    title: formData.title,
    excerpt: formData.excerpt,
    image: formData.image || null,
    status: formData.status,
    read_time: formData.readTime,
    category: formData.category,
    tags: formData.tags,
    featured: formData.featured,
    // A 'content' mezőt is hozzáadhatjuk, ha a PostFormData tartalmazza és a tábla is
    // content: formData.content || null,
  }

  const { data, error } = await supabase.from("posts").insert(newPostDbData).select().single()

  if (error) {
    console.error("Error adding post:", error)
    return { success: false, message: `Hiba a bejegyzés hozzáadásakor: ${error.message}` }
  }

  revalidatePath("/dashboard")
  revalidatePath("/posts")
  return { success: true, message: `"${(data as Post).title}" sikeresen létrehozva.`, post: data as Post }
}

export async function editPostAction(postId: number, formData: PostFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Authentikáció szükséges." }
  }

  // Itt is figyelni kell a 'date' mezőre, ha az a 'last_modified'-ot vagy egy 'publish_date'-et befolyásolna.
  // A last_modified automatikusan frissül a trigger által.
  const updatedPostDbData = {
    title: formData.title,
    excerpt: formData.excerpt,
    image: formData.image || null,
    status: formData.status,
    read_time: formData.readTime,
    category: formData.category,
    tags: formData.tags,
    featured: formData.featured,
    // content: formData.content || null,
    // author_id nem változik szerkesztéskor, hacsak nem engedélyezzük a szerző átruházását.
  }

  const { data, error } = await supabase.from("posts").update(updatedPostDbData).eq("id", postId).select().single()

  if (error) {
    console.error("Error editing post:", error)
    return { success: false, message: `Hiba a bejegyzés szerkesztésekor: ${error.message}` }
  }

  revalidatePath("/dashboard")
  revalidatePath("/posts")
  revalidatePath(`/posts/${postId}`) // Ha van egyedi bejegyzés oldal
  return { success: true, message: `"${(data as Post).title}" sikeresen módosítva.`, post: data as Post }
}

export async function deletePostAction(postId: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Authentikáció szükséges." }
  }

  const { error } = await supabase.from("posts").delete().eq("id", postId)

  if (error) {
    console.error("Error deleting post:", error)
    return { success: false, message: `Hiba a bejegyzés törlésekor: ${error.message}` }
  }

  revalidatePath("/dashboard")
  revalidatePath("/posts")
  return { success: true, message: "Bejegyzés sikeresen törölve." }
}
