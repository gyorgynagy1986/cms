import type React from "react"
import Sidebar from "@/components/cms/sidebar"
import Header from "@/components/cms/header"
import { Toaster } from "@/components/ui/toaster"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - only visible on desktop, manages its own state */}
      <Sidebar />
      
      {/* Main content - responsive margins handled by CSS */}
      <div className="ml-0 md:ml-20 lg:ml-64 transition-all duration-300">
        <Header profile={profile} />
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
      
      <Toaster />
    </div>
  )
}