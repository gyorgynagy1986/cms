"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Users, Upload, Settings } from "lucide-react"

interface QuickActionsProps {
  openAddPostDialog: () => void
}

export default function QuickActions({ openAddPostDialog }: QuickActionsProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleAddUser = () => {
    toast({
      title: "Funkció fejlesztés alatt",
      description: "Az új felhasználó hozzáadása funkció hamarosan elérhető lesz.",
      variant: "default",
    })
  }

  const handleFileUpload = () => {
    router.push("/media")
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gyors műveletek</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto p-3 flex flex-col items-start justify-start text-left"
            onClick={openAddPostDialog}
          >
            <Plus className="text-blue-600 mb-2" size={20} />
            <p className="font-medium text-gray-900">Új bejegyzés</p>
            <p className="text-xs text-gray-500">Tartalom létrehozása</p>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-3 flex flex-col items-start justify-start text-left"
            onClick={handleAddUser}
          >
            <Users className="text-green-600 mb-2" size={20} />
            <p className="font-medium text-gray-900">Felhasználó</p>
            <p className="text-xs text-gray-500">Új tag meghívása</p>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-3 flex flex-col items-start justify-start text-left"
            onClick={handleFileUpload}
          >
            <Upload className="text-purple-600 mb-2" size={20} />
            <p className="font-medium text-gray-900">Fájl feltöltés</p>
            <p className="text-xs text-gray-500">Média hozzáadása</p>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-3 flex flex-col items-start justify-start text-left"
            onClick={handleSettings}
          >
            <Settings className="text-orange-600 mb-2" size={20} />
            <p className="font-medium text-gray-900">Beállítások</p>
            <p className="text-xs text-gray-500">Rendszer konfiguráció</p>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
