"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Profile } from "@/lib/types"
import type { NewUserFormData, EditUserFormData } from "@/lib/actions/users"
import { addUserAction, editUserAction, deleteUserAction } from "@/lib/actions/users"
import UsersTable from "@/components/cms/users-table"
import EditUserDialog from "@/components/cms/edit-user-dialog"
import AddUserDialog from "@/components/cms/add-user-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Filter, Download, RefreshCw, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UsersPageClientProps {
  initialUsers: Profile[]
  searchTerm: string
  currentUserId?: string
}

export default function UsersPageClient({
  initialUsers,
  searchTerm,
  currentUserId,
}: UsersPageClientProps) {
  const [users, setUsers] = useState<Profile[]>(initialUsers)
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Sync users when initialUsers changes
  useEffect(() => {
    setUsers(initialUsers)
  }, [initialUsers])

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase()
    if (!search) return users
    return users.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(search)) ||
        (user.email && user.email.toLowerCase().includes(search)),
    )
  }, [users, searchTerm])

  const refreshUsers = () => {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleSaveUser = async (userId: string, updatedUserData: EditUserFormData) => {
    // Optimistic update
    const originalUsers = [...users]
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, ...updatedUserData }
        : user
    ))

    const result = await editUserAction(userId, updatedUserData)
    if (result.success) {
      toast({ title: "Sikeres mentés", description: result.message })
      setEditingUser(null)
      // Frissítjük a szerverről
      setTimeout(() => refreshUsers(), 500)
    } else {
      // Visszaállítjuk hiba esetén
      setUsers(originalUsers)
      toast({ title: "Hiba", description: result.message, variant: "destructive" })
    }
  }

  const handleAddUser = async (newUserData: NewUserFormData) => {
    const result = await addUserAction(newUserData)
    if (result.success) {
      // Optimistic update - hozzáadjuk az új usert
      const newUser: Profile = {
        id: `temp-${Date.now()}`, // Ideiglenes ID
        name: newUserData.name || "",
        email: newUserData.email || "",
        role: newUserData.role || "Writer",
        avatar_url: newUserData.avatar_url || null,
        department: newUserData.department || null,
        location: newUserData.location || null,
        status: newUserData.status || "active"
      }
      setUsers([newUser, ...users])

      toast({ title: "Felhasználó hozzáadva", description: result.message })
      setIsAddingUser(false)
      
      // Frissítjük a valós adatokkal
      setTimeout(() => refreshUsers(), 500)
    } else {
      toast({ title: "Hiba", description: result.message, variant: "destructive" })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId)
    if (!userToDelete) return

    if (!window.confirm(`Biztosan törölni szeretné ${userToDelete.name} felhasználót?`)) {
      return
    }

    // Optimistic update
    const originalUsers = [...users]
    setUsers(users.filter(user => user.id !== userId))

    const result = await deleteUserAction(userId)
    if (result.success) {
      toast({ title: "Felhasználó törölve", description: result.message })
      // Frissítjük a szerverről
      setTimeout(() => refreshUsers(), 500)
    } else {
      // Visszaállítjuk hiba esetén
      setUsers(originalUsers)
      toast({ title: "Hiba", description: result.message, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Actions - Mobile Optimized */}
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
        {/* Left Side Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setIsAddingUser(true)} className="flex-1 sm:flex-none">
            <Plus size={16} className="mr-2" />
            <span className="hidden sm:inline">Új felhasználó</span>
            <span className="sm:hidden">Új</span>
          </Button>
          
          <Button variant="outline" className="flex-1 sm:flex-none">
            <Filter size={16} className="mr-2" />
            <span className="hidden sm:inline">Szűrés</span>
            <span className="sm:hidden">Szűrő</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={refreshUsers}
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
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden lg:inline">
              {filteredUsers.length} felhasználó
            </span>
            <span className="text-xs text-muted-foreground lg:hidden">
              {filteredUsers.length}
            </span>
            
            {/* Export - Hidden on mobile */}
            <Button variant="outline" className="hidden sm:flex">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Search Info - Mobile Friendly */}
      {searchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center text-blue-800 dark:text-blue-200">
            <Search size={16} className="mr-2" />
            <span className="text-sm">
              Keresés: <strong>"{searchTerm}"</strong> - {filteredUsers.length} találat
            </span>
          </div>
        </div>
      )}

      {/* Content Area */}
      {filteredUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <UsersTable
            users={filteredUsers.map((user) => ({
              ...user,
              name: user.name ?? "",
              email: user.email ?? "",
            }))}
            onEdit={(user) =>
              setEditingUser({
                ...user,
                role:
                  user.role === "Writer" || user.role === "Admin" || user.role === "Editor"
                    ? user.role
                    : "Writer", // Default fallback
                status:
                  user.status === "active" || user.status === "inactive"
                    ? user.status
                    : "active", // Default fallback
              })
            }
            onDelete={handleDeleteUser}
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg md:text-xl">
              {searchTerm ? "Nincs találat" : "Nincsenek felhasználók"}
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              {searchTerm 
                ? `A "${searchTerm}" keresésre nincs találat. Próbáljon más kulcsszavakat.`
                : "Jelenleg nincsenek felhasználók a rendszerben. Hozza létre az első felhasználót!"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setIsAddingUser(true)}>
              <Plus size={16} className="mr-2" />
              Új felhasználó hozzáadása
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}
      
      <AddUserDialog 
        isOpen={isAddingUser} 
        onClose={() => setIsAddingUser(false)} 
        onSave={handleAddUser} 
      />
    </div>
  )
}