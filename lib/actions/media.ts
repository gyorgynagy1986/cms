"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { MediaFile } from "@/lib/types"

const MEDIA_BUCKET_NAME = "medialibrary" // Definiáljuk a bucket nevét

export async function listMediaFilesAction(folderPath = "") {
  try {
    const supabase = await createClient()

    if (!supabase?.storage) {
      console.error("Supabase client or storage not available")
      return { success: false, message: "Supabase kliens nem elérhető", files: [] }
    }

    const { data, error } = await supabase.storage.from(MEDIA_BUCKET_NAME).list(folderPath, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    })

    if (error) {
      console.error("Error listing media files:", error)
      return { success: false, message: `Hiba a fájlok listázásakor: ${error.message}`, files: [] }
    }

    const filesWithUrls: MediaFile[] = await Promise.all(
      (data || []).map(async (fileObject) => {
        const fullPath = folderPath ? `${folderPath}/${fileObject.name}` : fileObject.name
        const { data: urlData } = supabase.storage.from(MEDIA_BUCKET_NAME).getPublicUrl(fullPath)
        
        return {
          name: fileObject.name,
          id: fileObject.id || fileObject.name,
          path: fullPath, // Ez a fontos a törléshez!
          url: urlData.publicUrl,
          type: fileObject.metadata?.mimetype,
          size: fileObject.metadata?.size,
          created_at: fileObject.created_at,
          updated_at: fileObject.updated_at,
          last_accessed_at: fileObject.last_accessed_at,
          metadata: fileObject.metadata as any,
          thumbnail: fileObject.metadata?.mimetype?.startsWith("image/") ? urlData.publicUrl : undefined,
        }
      }),
    )

    return { success: true, files: filesWithUrls }
  } catch (error) {
    console.error("Unexpected error in listMediaFilesAction:", error)
    return { 
      success: false, 
      message: `Váratlan hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`, 
      files: [] 
    }
  }
}

export async function uploadMediaFileAction(formData: FormData) {
  console.log("=== UPLOAD DEBUG START ===")
  
  try {
    const file = formData.get("file") as File | null
    
    console.log("File info:", {
      exists: !!file,
      name: file?.name,
      size: file?.size,
      type: file?.type
    })

    if (!file) {
      return { success: false, message: "Nincs fájl kiválasztva." }
    }

    // Fájl méret ellenőrzés (50MB limit a config alapján)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      console.log("File too large:", file.size, "max:", maxSize)
      return { 
        success: false, 
        message: `A fájl túl nagy. Maximum 50MB engedélyezett. Jelenlegi: ${(file.size / 1024 / 1024).toFixed(2)}MB` 
      }
    }

    console.log("Creating Supabase client...")
    const supabase = await createClient()
    
    if (!supabase?.storage) {
      console.error("Supabase client or storage not available")
      return { success: false, message: "Supabase kliens nem elérhető" }
    }

    // User authentication ellenőrzés
    console.log("Checking user authentication...")
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log("Auth result:", {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      error: userError?.message
    })

    if (userError || !user) {
      return { 
        success: false, 
        message: `Hitelesítési hiba: ${userError?.message || 'Nincs bejelentkezett felhasználó'}` 
      }
    }

    // Egyedi fájlnév generálása
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const cleanFileName = file.name.replace(/\s/g, "_").replace(/[^a-zA-Z0-9._-]/g, "")
    const fileExt = cleanFileName.split('.').pop()
    const fileName = `${timestamp}-${randomString}.${fileExt}`
    
    console.log("Generated filename:", fileName)
    console.log("Bucket name:", MEDIA_BUCKET_NAME)

    // Feltöltés
    console.log("Starting upload...")
    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    console.log("Upload result:", {
      success: !!data,
      data: data,
      error: error?.message || null,
      fullError: error
    })

    if (error) {
      console.error("Upload failed:", error)
      return { 
        success: false, 
        message: `Feltöltési hiba: ${error.message}` 
      }
    }

    console.log("Upload successful!")
    console.log("=== UPLOAD DEBUG END ===")
    
    revalidatePath("/media")
    return { 
      success: true, 
      message: `"${file.name}" sikeresen feltöltve.`, 
      filePath: data.path 
    }

  } catch (error) {
    console.error("Unexpected upload error:", error)
    console.log("=== UPLOAD DEBUG END (ERROR) ===")
    return { 
      success: false, 
      message: `Váratlan hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}` 
    }
  }
}

export async function deleteMediaFileAction(filePath: string) {
  console.log("=== DELETE DEBUG START ===")
  console.log("Delete requested for:", filePath)
  
  try {
    if (!filePath) {
      return { success: false, message: "Nincs megadva fájl elérési út." }
    }

    console.log("Creating Supabase client...")
    const supabase = await createClient()
    
    if (!supabase?.storage) {
      console.error("Supabase client or storage not available")
      return { success: false, message: "Supabase kliens nem elérhető" }
    }

    // User authentication ellenőrzés
    console.log("Checking user authentication...")
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log("Auth result:", {
      hasUser: !!user,
      userId: user?.id,
      error: userError?.message
    })

    if (userError || !user) {
      return { 
        success: false, 
        message: `Hitelesítési hiba: ${userError?.message || 'Nincs bejelentkezett felhasználó'}` 
      }
    }

    console.log("Attempting to delete from bucket:", MEDIA_BUCKET_NAME)
    console.log("File path:", filePath)

    // Ellenőrizzük hogy létezik-e a fájl
    const { data: fileExists, error: checkError } = await supabase.storage
      .from(MEDIA_BUCKET_NAME)
      .list('', { search: filePath })

    console.log("File exists check:", {
      found: fileExists && fileExists.length > 0,
      checkError: checkError?.message
    })

    const { data, error } = await supabase.storage
      .from(MEDIA_BUCKET_NAME)
      .remove([filePath])

    console.log("Delete result:", {
      success: !!data && !error,
      data: data,
      error: error?.message || null,
      fullError: error
    })

    if (error) {
      console.error("Delete failed:", error)
      return { 
        success: false, 
        message: `Hiba a fájl törlésekor: ${error.message}` 
      }
    }

    console.log("Delete successful!")
    console.log("=== DELETE DEBUG END ===")

    revalidatePath("/media")
    return { success: true, message: `Fájl ("${filePath}") sikeresen törölve.` }

  } catch (error) {
    console.error("Unexpected delete error:", error)
    console.log("=== DELETE DEBUG END (ERROR) ===")
    return { 
      success: false, 
      message: `Váratlan hiba: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}` 
    }
  }
}

export async function getMediaPublicUrlAction(filePath: string) {
  try {
    const supabase = await createClient()
    
    if (!supabase?.storage) {
      return { publicUrl: null, error: "Supabase kliens nem elérhető" }
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET_NAME).getPublicUrl(filePath)
    return { publicUrl: data.publicUrl }
  } catch (error) {
    console.error("Error getting public URL:", error)
    return { 
      publicUrl: null, 
      error: error instanceof Error ? error.message : 'Ismeretlen hiba' 
    }
  }
}