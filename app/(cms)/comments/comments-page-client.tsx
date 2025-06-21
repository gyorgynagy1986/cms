"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type { Comment } from "@/lib/types"
import CommentsTable from "@/components/cms/comments-table"
import { Button } from "@/components/ui/button"
import { Filter, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateCommentStatusAction, deleteCommentAction } from "@/lib/actions/comments"
import { useState, useEffect } from "react"

interface CommentsPageClientProps {
  initialComments: Comment[]
  searchTerm: string
  currentStatusFilter: Comment["status"] | "all"
}

export default function CommentsPageClient({
  initialComments,
  searchTerm,
  currentStatusFilter,
}: CommentsPageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isMobile, setIsMobile] = useState(false)

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const handleStatusChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newStatus === "all") {
      params.delete("status")
    } else {
      params.set("status", newStatus)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const updateCommentStatus = async (id: number, status: Comment["status"]) => {
    const result = await updateCommentStatusAction(id, status)
    if (result.success) {
      toast({
        title: "Komment státusza frissítve",
        description: result.message,
      })
    } else {
      toast({
        title: "Hiba történt",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const deleteComment = async (id: number) => {
    const commentToDelete = initialComments.find((c) => c.id === id)
    if (!commentToDelete) return

    if (!window.confirm(`Biztosan törölni szeretné ezt a kommentet?`)) {
      return
    }

    const result = await deleteCommentAction(id)
    if (result.success) {
      toast({
        title: "Komment törölve",
        description: result.message,
      })
    } else {
      toast({
        title: "Hiba történt",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Actions - Mobile Optimized */}
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
        {/* Left Side - Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <Button variant="outline" disabled className="w-full sm:w-auto">
            <Filter size={16} className="mr-2" />
            <span className="hidden sm:inline">További szűrők (hamarosan)</span>
            <span className="sm:hidden">Szűrők</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {isMobile ? "Státusz:" : "Státusz:"}
            </span>
            <Select value={currentStatusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className={isMobile ? "w-full" : "w-[180px]"}>
                <SelectValue placeholder="Státusz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes</SelectItem>
                <SelectItem value="approved">Jóváhagyva</SelectItem>
                <SelectItem value="pending">Függőben</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Side - Count */}
        <div className="flex justify-between sm:justify-end">
          <span className="text-sm text-muted-foreground">
            {initialComments.length} komment
          </span>
        </div>
      </div>

      {/* Search Info - Mobile Friendly */}
      {searchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center text-blue-800 dark:text-blue-200">
            <Search size={16} className="mr-2" />
            <span className="text-sm">
              Keresés: <strong>"{searchTerm}"</strong> - {initialComments.length} találat
            </span>
          </div>
        </div>
      )}

      {/* Status Filter Info */}
      {currentStatusFilter !== "all" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 dark:bg-amber-900/20 dark:border-amber-800">
          <div className="flex items-center text-amber-800 dark:text-amber-200">
            <Filter size={16} className="mr-2" />
            <span className="text-sm">
              Szűrve: <strong>
                {currentStatusFilter === "approved" && "Jóváhagyott"}
                {currentStatusFilter === "pending" && "Függőben lévő"}
                {currentStatusFilter === "spam" && "Spam"}
              </strong> kommentek
            </span>
          </div>
        </div>
      )}

      {/* Content Area */}
      {initialComments.length > 0 ? (
        <div className="overflow-x-auto">
          <CommentsTable 
            comments={initialComments} 
            onStatusChange={updateCommentStatus} 
            onDelete={deleteComment} 
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg md:text-xl">
              {searchTerm || currentStatusFilter !== "all" ? "Nincs találat" : "Nincsenek kommentek"}
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              {searchTerm || currentStatusFilter !== "all"
                ? "Próbálja meg módosítani a keresési feltételeket vagy a státusz szűrőt."
                : "Még nincsenek kommentek a rendszerben."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground text-sm">
              A kommentek automatikusan megjelennek, amikor a felhasználók hozzászólnak a bejegyzésekhez.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}