"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import PostForm from "./post-form"
import type { PostFormData } from "@/lib/types"

interface AddPostDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (postData: PostFormData) => void
  defaultAuthorName?: string // Opcionális prop az alapértelmezett szerző nevéhez
}

export default function AddPostDialog({ isOpen, onClose, onSave, defaultAuthorName }: AddPostDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Új bejegyzés hozzáadása</DialogTitle>
          <DialogDescription>Töltse ki az alábbi űrlapot az új bejegyzés létrehozásához.</DialogDescription>
        </DialogHeader>
        <PostForm onSave={onSave} onCancel={onClose} defaultAuthorName={defaultAuthorName} />
      </DialogContent>
    </Dialog>
  )
}
