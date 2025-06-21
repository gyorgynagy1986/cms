"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type { Review } from "@/lib/types"
import ReviewsTable from "@/components/cms/reviews-table"
import { Button } from "@/components/ui/button"
import { Filter, Plus, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateReviewStatusAction, deleteReviewAction } from "@/lib/actions/reviews"
import { useState, useEffect } from "react"

interface ReviewsPageClientProps {
  initialReviews: Review[]
  searchTerm: string
  currentStatusFilter: Review["status"] | "all"
}

export default function ReviewsPageClient({ 
  initialReviews, 
  searchTerm, 
  currentStatusFilter 
}: ReviewsPageClientProps) {
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

  const updateReviewStatus = async (id: number, status: Review["status"]) => {
    const result = await updateReviewStatusAction(id, status)
    if (result.success) {
      toast({
        title: "Vélemény státusza frissítve",
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

  const deleteReview = async (id: number) => {
    const reviewToDelete = initialReviews.find((r) => r.id === id)
    if (!reviewToDelete) return

    if (!window.confirm(`Biztosan törölni szeretné ezt a véleményt?`)) {
      return
    }

    const result = await deleteReviewAction(id)
    if (result.success) {
      toast({
        title: "Vélemény törölve",
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
        {/* Left Side - Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <Button variant="outline" disabled className="w-full sm:w-auto">
            <Plus size={16} className="mr-2" />
            <span className="hidden sm:inline">Új vélemény (manuális)</span>
            <span className="sm:hidden">Új vélemény</span>
          </Button>
          
          <Button variant="outline" disabled className="w-full sm:w-auto">
            <Filter size={16} className="mr-2" />
            <span className="hidden sm:inline">További szűrők (hamarosan)</span>
            <span className="sm:hidden">Szűrők</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Státusz:
            </span>
            <Select value={currentStatusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className={isMobile ? "w-full" : "w-[180px]"}>
                <SelectValue placeholder="Státusz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Összes</SelectItem>
                <SelectItem value="pending">Függőben</SelectItem>
                <SelectItem value="approved">Jóváhagyva</SelectItem>
                <SelectItem value="rejected">Elutasítva</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Side - Count */}
        <div className="flex justify-between sm:justify-end">
          <span className="text-sm text-muted-foreground">
            {initialReviews.length} vélemény
          </span>
        </div>
      </div>

      {/* Search Info - Mobile Friendly */}
      {searchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center text-blue-800 dark:text-blue-200">
            <Search size={16} className="mr-2" />
            <span className="text-sm">
              Keresés: <strong>"{searchTerm}"</strong> - {initialReviews.length} találat
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
                {currentStatusFilter === "rejected" && "Elutasított"}
              </strong> vélemények
            </span>
          </div>
        </div>
      )}

      {/* Content Area */}
      {initialReviews.length > 0 ? (
        <div className="overflow-x-auto">
          <ReviewsTable 
            reviews={initialReviews} 
            onStatusChange={updateReviewStatus} 
            onDelete={deleteReview} 
          />
        </div>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg md:text-xl">
              {searchTerm || currentStatusFilter !== "all" ? "Nincs találat" : "Nincsenek vélemények"}
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              {searchTerm || currentStatusFilter !== "all"
                ? "Próbálja meg módosítani a keresési feltételeket vagy a státusz szűrőt."
                : "Még nincsenek vélemények a rendszerben."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground text-sm">
              A vélemények automatikusan megjelennek, amikor a felhasználók értékelik a termékeket vagy szolgáltatásokat.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}