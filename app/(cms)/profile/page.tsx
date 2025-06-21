import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, MapPin, Building, Calendar, Shield, Edit } from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    return redirect("/login")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "long", 
      day: "numeric"
    })
  }

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case "Admin":
        return "destructive"
      case "Editor":
        return "default"
      case "Writer":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusBadgeColor = (status: string | null) => {
    return status === "active" ? "default" : "secondary"
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="w-20 h-20 md:w-24 md:h-24">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || "Felhasználó"} />
              <AvatarFallback className="text-2xl md:text-3xl">
                {profile.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {profile.name || "Felhasználó"}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {profile.email}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  <Badge variant={getRoleBadgeColor(profile.role)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {profile.role || "Nincs szerepkör"}
                  </Badge>
                  <Badge variant={getStatusBadgeColor(profile.status)}>
                    {profile.status === "active" ? "Aktív" : "Inaktív"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Alapinformációk
            </CardTitle>
            <CardDescription>
              Személyes adatok és elérhetőségek
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Teljes név
              </Label>
              <Input
                id="name"
                value={profile.name || ""}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email cím
              </Label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={profile.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Szerepkör
              </Label>
              <Input
                id="role"
                value={profile.role || "Nincs megadva"}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Munkahelyi információk
            </CardTitle>
            <CardDescription>
              Részleg és helyszín adatok
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="department" className="text-sm font-medium">
                Részleg
              </Label>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="department"
                  value={profile.department || "Nincs megadva"}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Helyszín
              </Label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={profile.location || "Nincs megadva"}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Státusz
              </Label>
              <Input
                id="status"
                value={profile.status === "active" ? "Aktív" : "Inaktív"}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Fiók részletek
          </CardTitle>
          <CardDescription>
            Fiók létrehozása és utolsó aktivitás
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Fiók létrehozva
              </Label>
              <p className="text-sm font-medium">
                {user.created_at ? formatDate(user.created_at) : "Ismeretlen"}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Utolsó bejelentkezés
              </Label>
              <p className="text-sm font-medium">
                {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "Ismeretlen"}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Email megerősítve
              </Label>
              <p className="text-sm font-medium">
                {user.email_confirmed_at ? (
                  <span className="text-green-600">
                    ✓ {formatDate(user.email_confirmed_at)}
                  </span>
                ) : (
                  <span className="text-red-600">Nem megerősített</span>
                )}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Felhasználó ID
              </Label>
              <p className="text-xs font-mono bg-muted p-2 rounded">
                {user.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Profil kezelése</CardTitle>
          <CardDescription>
            Profil szerkesztése és fiók beállítások
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 sm:flex-none">
              <Edit className="w-4 h-4 mr-2" />
              Profil szerkesztése
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Shield className="w-4 h-4 mr-2" />
              Jelszó módosítása
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              Fiók beállítások
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}