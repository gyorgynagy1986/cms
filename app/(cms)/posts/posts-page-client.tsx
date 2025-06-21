"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Post, PostFormData } from "@/lib/types"
import PostsTable from "@/components/cms/posts-table"
import PostsGrid from "@/components/cms/posts-grid"
import AddPostDialog from "@/components/cms/add-post-dialog"
import EditPostDialog from "@/components/cms/edit-post-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Filter, Download, Upload, BarChart3, Layers, RefreshCw, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { addPostAction, editPostAction, deletePostAction } from "@/lib/actions/posts"

interface PostsPageClientProps {
  initialPosts: Post[]
  initialSearchTerm?: string
  currentUserProfile?: { name: string | null; avatar_url: string | null } | null
}

export default function PostsPageClient({
  initialPosts,
  initialSearchTerm = "",
  currentUserProfile,
}: PostsPageClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [isAddingPost, setIsAddingPost] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Auto set grid view on mobile
      if (mobile && viewMode === "table") {
        setViewMode("grid")
      }
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [viewMode])

  const filteredPosts = useMemo(() => {
    const search = initialSearchTerm.toLowerCase()
    if (!search) return posts
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(search) ||
        (post.profiles?.name && post.profiles.name.toLowerCase().includes(search)),
    )
  }, [posts, initialSearchTerm])

  const refreshPosts = () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Sync the posts when initialPosts changes (after router.refresh())
  useEffect(() => {
    setPosts(initialPosts)
  }, [initialPosts])

  const handleAddPost = async (newPostData: PostFormData) => {
    const result = await addPostAction(newPostData)
    if (result.success && result.post) {
      // Optimistic update: azonnal hozzáadjuk a listához
      const newPost: Post = {
        ...result.post,
        profiles: {
          name: currentUserProfile?.name || newPostData.author,
          avatar_url: currentUserProfile?.avatar_url || null
        }
      }
      setPosts([newPost, ...posts])
      
      toast({
        title: "Bejegyzés hozzáadva",
        description: `"${result.post.title}" sikeresen létrehozva.`,
      })
      setIsAddingPost(false)
      
      // Háttérben is frissítjük a szerver adatokkal
      setTimeout(() => refreshPosts(), 500)
    } else {
      toast({
        title: "Hiba történt",
        description: result.message || "A bejegyzés hozzáadása sikertelen.",
        variant: "destructive",
      })
    }
  }

  const handleEditPost = async (updatedPostData: Post) => {
    if (!editingPost) return

    const formData: PostFormData = {
      title: updatedPostData.title,
      excerpt: updatedPostData.excerpt || "",
      author: updatedPostData.profiles?.name || currentUserProfile?.name || "Ismeretlen",
      date: updatedPostData.created_at.split("T")[0],
      status: updatedPostData.status,
      readTime: updatedPostData.read_time || 0,
      category: updatedPostData.category || "",
      tags: updatedPostData.tags || [],
      featured: updatedPostData.featured,
      image: updatedPostData.image,
      content: updatedPostData.content,
    }

    // Optimistic update
    const originalPosts = [...posts]
    setPosts(posts.map(p => p.id === editingPost.id ? updatedPostData : p))

    const result = await editPostAction(editingPost.id, formData)
    if (result.success && result.post) {
      // Frissítjük a valós adatokkal
      setPosts(posts.map(p => p.id === editingPost.id ? { ...result.post!, profiles: updatedPostData.profiles } : p))
      
      toast({
        title: "Bejegyzés frissítve",
        description: `"${result.post.title}" sikeresen módosítva.`,
      })
      setEditingPost(null)
      
      // Háttérben frissítjük a szerver adatokkal
      setTimeout(() => refreshPosts(), 500)
    } else {
      // Ha sikertelen, visszaállítjuk az eredeti állapotot
      setPosts(originalPosts)
      toast({
        title: "Hiba történt",
        description: result.message || "A bejegyzés szerkesztése sikertelen.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = async (id: number) => {
    const postToDelete = posts.find((p) => p.id === id)
    if (!postToDelete) return

    // Optimistic update
    const originalPosts = [...posts]
    setPosts(posts.filter(post => post.id !== id))

    const result = await deletePostAction(id)
    if (result.success) {
      toast({
        title: "Bejegyzés törölve",
        description: `"${postToDelete.title}" sikeresen törölve lett.`,
      })
      
      // Frissítés a szerver adatokkal
      refreshPosts()
    } else {
      // Ha sikertelen, visszaállítjuk
      setPosts(originalPosts)
      toast({
        title: "Hiba történt",
        description: result.message || "A bejegyzés törlése sikertelen.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Actions - Mobile Optimized */}
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
        {/* Left Side Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setIsAddingPost(true)} className="flex-1 sm:flex-none">
            <Plus size={16} className="mr-2" />
            <span className="hidden sm:inline">Új bejegyzés</span>
            <span className="sm:hidden">Új</span>
          </Button>
          
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Filter size={16} className="mr-2" />
            <span className="hidden sm:inline">Szűrés</span>
            <span className="sm:hidden">Szűrő</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={refreshPosts}
            disabled={isRefreshing}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Frissítés</span>
            <span className="sm:hidden">Frissít</span>
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center justify-between">
          {/* View Toggle - Hidden on mobile if grid is forced */}
          {!isMobile && (
            <div className="flex items-center space-x-1 p-1 bg-muted rounded-lg mr-3">
              <Button
                size="icon"
                variant={viewMode === "table" ? "secondary" : "ghost"}
                onClick={() => setViewMode("table")}
              >
                <BarChart3 size={16} />
              </Button>
              <Button
                size="icon"
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                onClick={() => setViewMode("grid")}
              >
                <Layers size={16} />
              </Button>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden lg:inline">
              {filteredPosts.length} bejegyzés
            </span>
            <span className="text-xs text-muted-foreground lg:hidden">
              {filteredPosts.length}
            </span>
            
            {/* Export/Import - Smaller on mobile */}
            <Button variant="outline" size="icon" title="Exportálás" className="hidden sm:flex">
              <Download size={16} />
            </Button>
            <Button variant="outline" size="icon" title="Importálás" className="hidden sm:flex">
              <Upload size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Info - Mobile Friendly */}
      {initialSearchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center text-blue-800 dark:text-blue-200">
            <Search size={16} className="mr-2" />
            <span className="text-sm">
              Keresés: <strong>"{initialSearchTerm}"</strong> - {filteredPosts.length} találat
            </span>
          </div>
        </div>
      )}

      {/* Content Area */}
      {filteredPosts.length > 0 ? (
        viewMode === "table" && !isMobile ? (
          <div className="overflow-x-auto">
            <PostsTable posts={filteredPosts} onEdit={setEditingPost} onDelete={handleDeletePost} />
          </div>
        ) : (
          <PostsGrid posts={filteredPosts} onEdit={setEditingPost} onDelete={handleDeletePost} />
        )
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg md:text-xl">
              {initialSearchTerm ? "Nincs találat" : "Nincsenek bejegyzések"}
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              {initialSearchTerm 
                ? `A "${initialSearchTerm}" keresésre nincs találat. Próbáljon más kulcsszavakat.`
                : "Jelenleg nincsenek bejegyzések. Hozza létre az első bejegyzést!"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setIsAddingPost(true)}>
              <Plus size={16} className="mr-2" />
              Új bejegyzés hozzáadása
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <AddPostDialog
        isOpen={isAddingPost}
        onClose={() => setIsAddingPost(false)}
        onSave={handleAddPost}
        defaultAuthorName={currentUserProfile?.name || "Admin"}
      />

      {editingPost && (
        <EditPostDialog
          post={editingPost}
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleEditPost}
        />
      )}
    </div>
  )
}