"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import UserForm from "./user-form"
import type { User } from "@/lib/types"
import type { NewUserFormData } from "@/lib/actions/users"

interface AddUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (userData: NewUserFormData) => void
}

export default function AddUserDialog({ isOpen, onClose, onSave }: AddUserDialogProps) {
  const defaultNewUser: User & { password?: string } = {
    id: "", // Az ID-t a szerver generálja
    name: "",
    email: "",
    role: "Writer" as "Admin" | "Editor" | "Writer",
    avatar_url: "",
    department: "",
    location: "",
    status: "active",
    password: "",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Új felhasználó hozzáadása</DialogTitle>
          <DialogDescription>Töltse ki az alábbi űrlapot az új felhasználó létrehozásához.</DialogDescription>
        </DialogHeader>
        <UserForm
          user={defaultNewUser}
          onSave={(user) => onSave(user as NewUserFormData)}
          onCancel={onClose}
          isAddingNewUser={true}
        />
      </DialogContent>
    </Dialog>
  )
}
