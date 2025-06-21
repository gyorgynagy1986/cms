"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import PostForm from "./post-form"
import type { Post, PostFormData } from "@/lib/types"

interface EditPostDialogProps {
  post: Post
  isOpen: boolean
  onClose: () => void
  onSave: (postData: Post) => void // For editing, we expect the full Post object back, potentially with ID
}

export default function EditPostDialog({ post, isOpen, onClose, onSave }: EditPostDialogProps) {
  const handleFormSave = (formData: PostFormData) => {
    // Combine original post data (like ID) with form data
    const updatedPost: Post = {
      ...post, // Spread original post to keep ID and other non-form fields
      ...formData, // Spread form data to update editable fields
      // Manually map form data to Post structure
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      status: formData.status,
      read_time: formData.readTime,
      category: formData.category,
      tags: formData.tags,
      featured: formData.featured,
      image: formData.image ?? null,
      // Keep original post metadata
      id: post.id,
      created_at: post.created_at,
      last_modified: new Date().toISOString(),
      author_id: post.author_id,
      views: post.views,
      comments_count: post.comments_count,
      likes: post.likes,
      seo_score: post.seo_score,
      profiles: post.profiles,
    }
    onSave(updatedPost)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg md:text-xl">Bejegyzés szerkesztése</DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Módosítsa a bejegyzés adatait. A mentéshez kattintson a gombra.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <PostForm post={post} onSave={handleFormSave} onCancel={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  )
}