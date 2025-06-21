"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckCircle, XCircle, AlertTriangle, MoreHorizontal, Trash2, Star, MessageSquare, Calendar, Package, User } from "lucide-react"
import type { Review } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ReviewsTableProps {
  reviews: Review[]
  onStatusChange: (id: number, status: Review["status"]) => void
  onDelete: (id: number) => void
}

const RatingStars = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}
      />
    ))}
  </div>
)

export default function ReviewsTable({ reviews, onStatusChange, onDelete }: ReviewsTableProps) {
  const getStatusBadgeInfo = (status: Review["status"]) => {
    switch (status) {
      case "approved":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
          icon: <CheckCircle size={12} className="mr-1" />,
          text: "Jóváhagyva",
        }
      case "pending":
        return {
          variant: "outline" as const,
          className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
          icon: <AlertTriangle size={12} className="mr-1" />,
          text: "Függőben",
        }
      case "rejected":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
          icon: <XCircle size={12} className="mr-1" />,
          text: "Elutasítva",
        }
      default:
        return { variant: "secondary" as const, className: "", icon: null, text: "Ismeretlen" }
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[280px]">Szerző & Vélemény</TableHead>
              <TableHead className="min-w-[120px] hidden lg:table-cell">Termék</TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">Dátum</TableHead>
              <TableHead className="min-w-[120px] hidden md:table-cell">Státusz</TableHead>
              <TableHead className="text-right min-w-[80px]">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => {
              const statusInfo = getStatusBadgeInfo(review.status)
              return (
                <TableRow key={review.id}>
                  {/* Author & Review Column - Always visible, comprehensive on mobile */}
                  <TableCell>
                    <div className="space-y-3">
                      {/* Author Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0">
                          <AvatarImage
                            src={review.profiles?.avatar_url || `/placeholder.svg?width=36&height=36&query=avatar`}
                            alt={review.profiles?.name || "Ismeretlen"}
                          />
                          <AvatarFallback className="text-xs">
                            {review.profiles?.name ? review.profiles.name.substring(0, 2).toUpperCase() : "N/A"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm md:text-base">
                            {review.profiles?.name || "Ismeretlen szerző"}
                          </div>
                          <div className="flex items-center space-x-2">
                            <RatingStars rating={review.rating} size={14} />
                            <span className="text-xs text-muted-foreground">
                              ({review.rating}/5)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Review Content */}
                      <div className="pl-11 md:pl-12">
                        {review.title && (
                          <p className="font-medium text-sm mb-1 text-foreground line-clamp-1">
                            {review.title}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-3 md:line-clamp-2">
                          {review.content}
                        </p>
                      </div>
                      
                      {/* Mobile Info - Product, Date, Status */}
                      <div className="flex flex-wrap items-center gap-2 pl-11 md:pl-12 lg:hidden">
                        {/* Product info on mobile */}
                        {(review.product_name || review.product_id) && (
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Package size={10} className="mr-1" />
                            <span className="truncate max-w-32">
                              {review.product_name || `ID: ${review.product_id}`}
                            </span>
                          </div>
                        )}
                        
                        {/* Date on mobile */}
                        <div className="flex items-center text-xs text-muted-foreground md:hidden">
                          <Calendar size={10} className="mr-1" />
                          <span>{new Date(review.created_at).toLocaleDateString("hu-HU")}</span>
                        </div>
                        
                        {/* Status on mobile */}
                        <div className="md:hidden">
                          <Badge variant={statusInfo.variant} className={`${statusInfo.className} text-xs`}>
                            {statusInfo.icon}
                            {statusInfo.text}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Product Column - Hidden on mobile/tablet */}
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm">
                      {review.product_name || (review.product_id ? `ID: ${review.product_id}` : "-")}
                    </div>
                  </TableCell>
                  
                  {/* Date Column - Hidden on mobile */}
                  <TableCell className="hidden md:table-cell text-sm">
                    {new Date(review.created_at).toLocaleDateString("hu-HU")}
                  </TableCell>
                  
                  {/* Status Column - Hidden on mobile */}
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={statusInfo.variant} className={statusInfo.className}>
                      {statusInfo.icon}
                      {statusInfo.text}
                    </Badge>
                  </TableCell>
                  
                  {/* Actions Column - Always visible, responsive */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {review.status !== "approved" && (
                          <DropdownMenuItem onClick={() => onStatusChange(review.id, "approved")}>
                            <CheckCircle size={14} className="mr-2 text-green-600" /> Jóváhagyás
                          </DropdownMenuItem>
                        )}
                        {review.status !== "rejected" && (
                          <DropdownMenuItem onClick={() => onStatusChange(review.id, "rejected")}>
                            <XCircle size={14} className="mr-2 text-red-600" /> Elutasítás
                          </DropdownMenuItem>
                        )}
                        {review.status !== "pending" &&
                          (review.status === "approved" || review.status === "rejected") && (
                            <DropdownMenuItem onClick={() => onStatusChange(review.id, "pending")}>
                              <AlertTriangle size={14} className="mr-2 text-yellow-600" /> Függőbe helyezés
                            </DropdownMenuItem>
                          )}
                        <DropdownMenuItem disabled>
                          <MessageSquare size={14} className="mr-2" /> Válasz (hamarosan)
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(review.id)} 
                          className="text-red-600 hover:!text-red-600"
                        >
                          <Trash2 size={14} className="mr-2" /> Törlés
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}