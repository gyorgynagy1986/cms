"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin" // Új admin client
import type { Profile } from "@/lib/types"
import { revalidatePath } from "next/cache"

// Típus az új felhasználó űrlap adataihoz
export type NewUserFormData = Omit<Profile, "id"> & { password: string }
// Típus a profil szerkesztéséhez
export type EditUserFormData = Omit<Profile, "id" | "email">

export async function addUserAction(formData: NewUserFormData) {
  console.log("=== ADD USER DEBUG START ===")
  console.log("Form data received:", {
    name: formData.name,
    email: formData.email,
    role: formData.role,
    hasPassword: !!formData.password,
    passwordLength: formData.password?.length || 0
  })

  try {
    // Admin client mindkét művelethez
    const adminSupabase = await createAdminClient()

    // Validáció
    if (!formData.email || !formData.password) {
      return { success: false, message: "Az email cím és a jelszó megadása kötelező." }
    }

    if (formData.password.length < 6) {
      return { success: false, message: "A jelszónak legalább 6 karakter hosszúnak kell lennie." }
    }

    console.log("Creating auth user with admin client...")

    // 1. Felhasználó létrehozása az Auth rendszerben (admin client)
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: true,
      user_metadata: {
        name: formData.name
      }
    })

    if (authError) {
      console.error("Auth user creation failed:", authError)
      return { success: false, message: `Hiba a felhasználó létrehozásakor: ${authError.message}` }
    }

    console.log("Auth user created:", authData.user.id)

    const newUserId = authData.user.id

    // 2. Profil létrehozása a 'profiles' táblában (admin client - bypass RLS)
    const profileData = {
      id: newUserId,
      name: formData.name || null,
      email: formData.email,
      role: formData.role || "Writer",
      avatar_url: formData.avatar_url || null,
      department: formData.department || null,
      location: formData.location || null,
      status: formData.status || "active",
    }

    console.log("Creating profile with admin client...")

    const { error: profileError } = await adminSupabase.from("profiles").insert(profileData)

    if (profileError) {
      console.error("Profile creation failed:", profileError)
      // Hiba esetén visszagörgetjük az auth user létrehozását
      console.log("Rolling back auth user...")
      await adminSupabase.auth.admin.deleteUser(newUserId)
      return { success: false, message: `Hiba a profil létrehozásakor: ${profileError.message}` }
    }

    console.log("Profile created successfully")
    console.log("=== ADD USER DEBUG END ===")

    revalidatePath("/users")
    return { success: true, message: `${formData.name} sikeresen hozzáadva.` }

  } catch (error) {
    console.error("Unexpected error in addUserAction:", error)
    console.log("=== ADD USER DEBUG END (ERROR) ===")
    return { 
      success: false, 
      message: `Váratlan hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}` 
    }
  }
}

export async function editUserAction(userId: string, formData: EditUserFormData) {
  console.log("=== EDIT USER DEBUG START ===")
  console.log("User ID:", userId)
  console.log("Form data:", formData)

  try {
    // Admin client használata a profiles frissítéshez is
    const adminSupabase = await createAdminClient()

    const { error } = await adminSupabase
      .from("profiles")
      .update({
        name: formData.name || null,
        role: formData.role || "Writer",
        avatar_url: formData.avatar_url || null,
        department: formData.department || null,
        location: formData.location || null,
        status: formData.status || "active",
      })
      .eq("id", userId)

    if (error) {
      console.error("Profile update failed:", error)
      return { success: false, message: `Hiba a profil frissítésekor: ${error.message}` }
    }

    console.log("Profile updated successfully")
    console.log("=== EDIT USER DEBUG END ===")

    revalidatePath("/users")
    return { success: true, message: `${formData.name} adatai sikeresen frissítve.` }

  } catch (error) {
    console.error("Unexpected error in editUserAction:", error)
    console.log("=== EDIT USER DEBUG END (ERROR) ===")
    return { 
      success: false, 
      message: `Váratlan hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}` 
    }
  }
}

export async function deleteUserAction(userId: string) {
  console.log("=== DELETE USER DEBUG START ===")
  console.log("User ID to delete:", userId)

  try {
    // Admin client mindkét művelethez
    const adminSupabase = await createAdminClient()
    const supabase = await createClient()

    // Ellenőrizzük ki van bejelentkezve
    const { data: { user: currentUser }, error: currentUserError } = await supabase.auth.getUser()
    
    if (currentUserError || !currentUser) {
      return { success: false, message: "Hitelesítés szükséges." }
    }

    console.log("Current user:", currentUser.id)
    console.log("User to delete:", userId)

    // BIZTONSÁGI ELLENŐRZÉS: Saját magát nem törölheti
    if (currentUser.id === userId) {
      console.log("User trying to delete themselves - BLOCKED")
      return { 
        success: false, 
        message: "Saját magad nem törölheted! Ez biztonsági okokból nem engedélyezett." 
      }
    }

    // Ellenőrizzük hogy létezik-e a törlendő felhasználó
    const { data: existingUser, error: checkError } = await adminSupabase
      .from("profiles")
      .select("name, email")
      .eq("id", userId)
      .single()

    if (checkError || !existingUser) {
      console.error("User not found:", checkError)
      return { success: false, message: "A felhasználó nem található." }
    }

    console.log("Deleting user:", existingUser.name, existingUser.email)

    // Az auth.users-ből való törlés automatikusan törli a profilt a 'on delete cascade' miatt
    const { error } = await adminSupabase.auth.admin.deleteUser(userId)

    if (error) {
      console.error("User deletion failed:", error)
      return { success: false, message: `Hiba a felhasználó törlésekor: ${error.message}` }
    }

    console.log("User deleted successfully")
    console.log("=== DELETE USER DEBUG END ===")

    revalidatePath("/users")
    return { success: true, message: `${existingUser.name} felhasználó sikeresen törölve.` }

  } catch (error) {
    console.error("Unexpected error in deleteUserAction:", error)
    console.log("=== DELETE USER DEBUG END (ERROR) ===")
    return { 
      success: false, 
      message: `Váratlan hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}` 
    }
  }
}