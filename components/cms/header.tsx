"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { Search, Bell, ChevronDown, Clock, LogOut, User, SettingsIcon, Sun, Moon, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  FileText,
  Users,
  MessageSquare,
  ImageIcon,
  TrendingUp,
  Settings,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

const viewTitles: { [key: string]: string } = {
  "/dashboard": "Áttekintés",
  "/posts": "Bejegyzések",
  "/users": "Felhasználók",
  "/comments": "Kommentek",
  "/reviews": "Vélemények",
  "/media": "Média",
  "/analytics": "Analitika",
  "/settings": "Beállítások",
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Bejegyzések", href: "/posts", icon: FileText },
  { name: "Felhasználók", href: "/users", icon: Users },
  { name: "Kommentek", href: "/comments", icon: MessageSquare },
  { name: "Vélemények", href: "/reviews", icon: Star },
  { name: "Média", href: "/media", icon: ImageIcon },
  { name: "Analitika", href: "/analytics", icon: TrendingUp },
  { name: "Beállítások", href: "/settings", icon: Settings },
]

interface Profile {
  name: string | null
  role: string | null
  avatar_url: string | null
}

interface HeaderProps {
  profile: Profile | null
}

export default function Header({ profile }: HeaderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const title = viewTitles[pathname] || "Dashboard"
  const { theme, setTheme } = useTheme()
  const supabase = createClient()
  const [showSearch, setShowSearch] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("q", term)
    } else {
      params.delete("q")
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-background/95 shadow-sm border-b px-3 md:px-6 py-3 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile Menu + Title */}
        <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
          {/* Mobile hamburger menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Menü megnyitása"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white h-full">
                <SheetHeader className="p-4 border-b border-gray-700">
                  <SheetTitle className="flex items-center space-x-2 text-white">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="text-white" size={20} />
                    </div>
                    <span className="font-bold text-xl">AdminPanel</span>
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="mt-4 px-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleMobileNavClick}
                      className={cn(
                        "w-full flex items-center px-3 py-3 mb-1 text-left rounded-lg hover:bg-gray-700 transition-colors",
                        pathname === item.href 
                          ? "bg-blue-600 text-white shadow-lg" 
                          : "text-gray-300 hover:text-white"
                      )}
                    >
                      <item.icon size={20} />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  ))}
                </nav>

                {/* Mobile menu footer */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">Rendszer OK</span>
                    </div>
                    <div className="text-xs text-gray-400">Utolsó frissítés: most</div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 min-w-0 flex-1">
            <h2 className="text-lg md:text-2xl font-semibold text-foreground capitalize truncate">
              {title}
            </h2>
            <div className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock size={14} />
              <span>{new Date().toLocaleString("hu-HU", { dateStyle: "long", timeStyle: "short" })}</span>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Search - Desktop always visible */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              type="text"
              placeholder="Keresés..."
              defaultValue={searchParams.get("q") || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-32 lg:w-64"
            />
          </div>

          {/* Mobile search toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden"
            aria-label="Keresés"
          >
            <Search size={18} />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Témaváltás"
            className="hidden sm:flex"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 h-3 w-3 md:h-4 md:w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-1 md:space-x-2 p-1 md:p-2 h-auto"
              >
                <Avatar className="w-7 h-7 md:w-8 md:h-8 ring-2 ring-primary">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.name || "User"} />
                  <AvatarFallback className="text-xs">{profile?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="hidden xl:block text-left">
                  <p className="font-medium text-foreground text-sm">{profile?.name || "Felhasználó"}</p>
                  <p className="text-muted-foreground text-xs">{profile?.role || "Szerepkör"}</p>
                </div>
                <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="bottom" sideOffset={5}>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{profile?.name || "Felhasználó"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{profile?.role || "Szerepkör"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  // TODO: Navigate to profile page
                  console.log('Profile clicked')
                }}
              >
                <User className="mr-2 h-4 w-4" />
                <Link href="/profile">Profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/settings")
                }}
              >
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Beállítások</span>
              </DropdownMenuItem>
              {/* Mobile-only theme toggle */}
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault()
                  setTheme(theme === "light" ? "dark" : "light")
                }}
                className="sm:hidden cursor-pointer"
              >
                {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                <span>Témaváltás</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Kijelentkezés</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile search bar */}
      {showSearch && (
        <div className="md:hidden mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            type="text"
            placeholder="Keresés..."
            defaultValue={searchParams.get("q") || ""}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
            autoFocus
          />
        </div>
      )}
    </header>
  )
}