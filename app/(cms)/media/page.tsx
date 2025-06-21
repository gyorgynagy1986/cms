// app/(cms)/media/page.tsx
import { listMediaFilesAction } from "@/lib/actions/media"
import MediaPageClient from "./media-page-client" // vagy ahogy nevezted el

export default async function MediaPage() {
  try {
    console.log("MediaPage: Starting to list media files...")
    
    const result = await listMediaFilesAction("")
    
    console.log("MediaPage: Result received:", {
      success: result.success,
      filesCount: result.files?.length || 0,
      message: result.message
    })

    if (!result.success) {
      return (
        <MediaPageClient 
          initialMediaFiles={[]} 
          errorMessage={result.message || "Ismeretlen hiba történt a fájlok betöltésekor"}
        />
      )
    }

    return (
      <MediaPageClient 
        initialMediaFiles={result.files || []} 
      />
    )
  } catch (error) {
    console.error("MediaPage: Unexpected error:", error)
    
    return (
      <MediaPageClient 
        initialMediaFiles={[]} 
        errorMessage={`Váratlan hiba történt: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`}
      />
    )
  }
}