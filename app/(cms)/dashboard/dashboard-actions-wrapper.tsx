"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import QuickActions from "@/components/cms/quick-actions"
import AddPostDialog from "@/components/cms/add-post-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { PostFormData } from "@/lib/types"
import { addPostAction } from "@/lib/actions/posts"

export default function DashboardActionsWrapper() {
  const [isAddingPost, setIsAddingPost] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleOpenAddPostDialog = () => {
    setIsAddingPost(true)
  }

  const handleSaveNewPost = async (newPostData: PostFormData) => {
    setIsLoading(true)
    
    try {
      const result = await addPostAction(newPostData)

      if (result.success && result.post) {
        toast({
          title: "Bejegyzés hozzáadva",
          description: `"${result.post.title}" sikeresen létrehozva.`,
        })
        setIsAddingPost(false)
        
        // Refresh strategy optimalizálása
        if (typeof window !== 'undefined') {
          // Próbáld router.refresh() először, fallback window.location.reload()
          try {
            router.refresh()
            // Ha van időd, setTimeout-tal ellenőrizd hogy frissült-e, ha nem akkor reload
            setTimeout(() => {
              // Egyszerű fallback ha a router.refresh() nem működött megfelelően
              window.location.reload()
            }, 1000)
          } catch {
            window.location.reload()
          }
        }
      } else {
        toast({
          title: "Hiba történt",
          description: result.message || "A bejegyzés hozzáadása sikertelen.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding post:', error)
      toast({
        title: "Hiba történt",
        description: "Váratlan hiba történt a bejegyzés hozzáadása során.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseDialog = () => {
    if (!isLoading) {
      setIsAddingPost(false)
    }
  }

  return (
    <>
      <QuickActions 
        openAddPostDialog={handleOpenAddPostDialog}
      />
      <AddPostDialog 
        isOpen={isAddingPost} 
        onClose={handleCloseDialog}
        onSave={handleSaveNewPost}
      />
    </>
  )
}