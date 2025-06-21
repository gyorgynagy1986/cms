"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import type { Profile } from "@/lib/types"

interface UserFormProps {
  user: (Profile & { password?: string }) | { 
    id?: string
    name?: string | null
    email?: string | null
    role?: "Admin" | "Editor" | "Writer" | null
    avatar_url?: string | null
    department?: string | null
    location?: string | null
    status?: "active" | "inactive" | null
    password?: string
  }
  onSave: (user: any) => void
  onCancel: () => void
  isAddingNewUser?: boolean
}

export default function UserForm({ user, onSave, onCancel, isAddingNewUser = false }: UserFormProps) {
  const [formData, setFormData] = useState(user)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  useEffect(() => {
    setFormData(user)
    setErrors({})
  }, [user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = "A név megadása kötelező"
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Az email cím megadása kötelező"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Érvénytelen email cím formátum"
    }

    if (isAddingNewUser && (!formData.password || formData.password.length < 6)) {
      newErrors.password = "A jelszónak legalább 6 karakter hosszúnak kell lennie"
    }

    if (!formData.role) {
      newErrors.role = "A szerepkör megadása kötelező"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSave(formData)
  }

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex-1 overflow-hidden">
        <div className={`grid gap-4 md:gap-6 py-4 px-1 ${isMobile ? 'max-h-[calc(100vh-240px)]' : 'max-h-[70vh]'} overflow-y-auto`}>
          
          {/* Név mező */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-4 items-center gap-4'}`}>
            <Label htmlFor="name" className={isMobile ? 'text-sm font-medium' : 'text-right'}>
              Név *
            </Label>
            <div className={isMobile ? 'col-span-1' : 'col-span-3'}>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className={`text-sm md:text-base focus:ring-2 focus:ring-inset ${errors.name ? "border-red-500" : ""}`}
                placeholder="Teljes név"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Email mező */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-4 items-center gap-4'}`}>
            <Label htmlFor="email" className={isMobile ? 'text-sm font-medium' : 'text-right'}>
              Email *
            </Label>
            <div className={isMobile ? 'col-span-1' : 'col-span-3'}>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                className={`text-sm md:text-base focus:ring-2 focus:ring-inset ${errors.email ? "border-red-500" : ""}`}
                placeholder="pelda@email.com"
                disabled={!isAddingNewUser}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
              {!isAddingNewUser && (
                <p className="text-xs text-muted-foreground mt-1">
                  Az email cím szerkesztés során nem módosítható
                </p>
              )}
            </div>
          </div>

          {/* Jelszó mező - csak új user esetén */}
          {isAddingNewUser && (
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-4 items-center gap-4'}`}>
              <Label htmlFor="password" className={isMobile ? 'text-sm font-medium' : 'text-right'}>
                Jelszó *
              </Label>
              <div className={isMobile ? 'col-span-1' : 'col-span-3'}>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password || ""}
                    onChange={handleChange}
                    className={`text-sm md:text-base focus:ring-2 focus:ring-inset ${errors.password ? "border-red-500 pr-10" : "pr-10"}`}
                    placeholder="Minimum 6 karakter"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            </div>
          )}

          {/* Szerepkör */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-4 items-center gap-4'}`}>
            <Label htmlFor="role" className={isMobile ? 'text-sm font-medium' : 'text-right'}>
              Szerepkör *
            </Label>
            <div className={isMobile ? 'col-span-1' : 'col-span-3'}>
              <Select 
                value={formData.role || "Writer"} 
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className={`text-sm md:text-base focus:ring-2 focus:ring-inset ${errors.role ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Válasszon szerepkört" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Writer">Writer</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500 mt-1">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Részleg */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-4 items-center gap-4'}`}>
            <Label htmlFor="department" className={isMobile ? 'text-sm font-medium' : 'text-right'}>
              Részleg
            </Label>
            <Input
              id="department"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              className={`text-sm md:text-base focus:ring-2 focus:ring-inset ${isMobile ? 'col-span-1' : 'col-span-3'}`}
              placeholder="pl. IT, Marketing, HR"
            />
          </div>

          {/* Helyszín */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-4 items-center gap-4'}`}>
            <Label htmlFor="location" className={isMobile ? 'text-sm font-medium' : 'text-right'}>
              Helyszín
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className={`text-sm md:text-base focus:ring-2 focus:ring-inset ${isMobile ? 'col-span-1' : 'col-span-3'}`}
              placeholder="pl. Budapest, Debrecen"
            />
          </div>

          {/* Státusz */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-4 items-center gap-4'}`}>
            <Label htmlFor="status" className={isMobile ? 'text-sm font-medium' : 'text-right'}>
              Státusz
            </Label>
            <Select 
              value={formData.status || "active"} 
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger className={`text-sm md:text-base focus:ring-2 focus:ring-inset ${isMobile ? 'col-span-1' : 'col-span-3'}`}>
                <SelectValue placeholder="Válasszon státuszt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktív</SelectItem>
                <SelectItem value="inactive">Inaktív</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Avatar URL */}
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-4 items-center gap-4'}`}>
            <Label htmlFor="avatar_url" className={isMobile ? 'text-sm font-medium' : 'text-right'}>
              Avatar URL
            </Label>
            <Input
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url || ""}
              onChange={handleChange}
              className={`text-sm md:text-base focus:ring-2 focus:ring-inset ${isMobile ? 'col-span-1' : 'col-span-3'}`}
              placeholder="https://example.com/avatar.png"
            />
          </div>

          {/* Figyelmeztetés új felhasználó esetén */}
          {isAddingNewUser && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs md:text-sm">
                Az új felhasználó automatikusan hozzáadódik a rendszerhez. 
                A megadott email címre nem érkezik értesítő email.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Sticky Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4 md:mt-6 pt-3 md:pt-4 border-t dark:border-gray-700 bg-background/95 backdrop-blur-sm">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto text-sm md:text-base"
          >
            Mégse
          </Button>
          <Button 
            type="submit"
            className="w-full sm:w-auto text-sm md:text-base"
          >
            {isAddingNewUser ? "Felhasználó létrehozása" : "Mentés"}
          </Button>
        </div>
      </form>
    </div>
  )
}