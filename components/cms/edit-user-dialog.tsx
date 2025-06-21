"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import UserForm from "./user-form"
import type { User } from "@/lib/types"
import type { EditUserFormData } from "@/lib/actions/users"

interface EditUserDialogProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSave: (userId: string, userData: EditUserFormData) => void
}

export default function EditUserDialog({ user, isOpen, onClose, onSave }: EditUserDialogProps) {
  const handleSave = (formData: User) => {
    const { id, email, status, ...rest } = formData
    const editData: EditUserFormData = {
      ...rest,
      role:
        rest.role === "Admin" || rest.role === "Editor" || rest.role === "Writer"
          ? rest.role
          : null,
      status: status === "active" || status === "inactive" ? status : null,
    }
    onSave(id, editData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Felhasználó szerkesztése</DialogTitle>
          <DialogDescription>Módosítsa a felhasználó adatait. A mentéshez kattintson a gombra.</DialogDescription>
        </DialogHeader>
        <UserForm
          user={{
            ...user,
            role:
              user.role === "Admin" || user.role === "Editor" || user.role === "Writer"
                ? user.role
                : null,
          }}
          onSave={handleSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
