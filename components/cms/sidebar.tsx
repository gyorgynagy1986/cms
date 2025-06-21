"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  Users,
  MessageSquare,
  ImageIcon,
  TrendingUp,
  Settings,
  Code,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Auto-collapse on smaller screens, expand on larger
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Don't render sidebar on mobile - navigation is in header hamburger menu
  if (isMobile) {
    return null
  }

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen transition-all duration-300 fixed left-0 top-0 z-30 shadow-2xl",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 h-[68px] border-b border-gray-700">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="text-white" size={20} />
            </div>
            <h1 className="text-white font-bold text-xl">AdminPanel</h1>
          </Link>
        )}
        
        {/* Toggle button */}
        <button
          onClick={handleToggle}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          aria-label={isCollapsed ? "Sidebar kibontása" : "Sidebar összecsukása"}
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      <nav className="mt-4 px-2 overflow-y-auto">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "w-full flex items-center px-3 py-3 mb-1 text-left rounded-lg hover:bg-gray-700 transition-colors group",
              pathname === item.href 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-gray-300 hover:text-white",
              isCollapsed && "justify-center"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon size={20} />
            <span className={cn("ml-3", isCollapsed && "hidden")}>
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Status indicator - only show when sidebar is expanded */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Rendszer OK</span>
            </div>
            <div className="text-xs text-gray-400">Utolsó frissítés: most</div>
          </div>
        </div>
      )}
    </div>
  )
}