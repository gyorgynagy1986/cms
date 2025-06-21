"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckCircle, Edit, MessageSquare, MoreHorizontal, Trash2, ShieldAlert, AlertTriangle, Calendar, FileText, User, Mail } from "lucide-react"
import type { Comment } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommentsTableProps {
  comments: Comment[]
  onStatusChange: (id: number, status: Comment["status"]) => void
  onDelete: (id: number) => void
}

export default function CommentsTable({ comments, onStatusChange, onDelete }: CommentsTableProps) {
  const getStatusBadgeInfo = (status: Comment["status"]) => {
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
      case "spam":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
          icon: <ShieldAlert size={12} className="mr-1" />,
          text: "Spam",
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
              <TableHead className="min-w-[250px]">Szerző & Komment</TableHead>
              <TableHead className="min-w-[150px] hidden lg:table-cell">Bejegyzés</TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">Dátum</TableHead>
              <TableHead className="min-w-[120px] hidden md:table-cell">Státusz</TableHead>
              <TableHead className="text-right min-w-[80px]">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => {
              const statusInfo = getStatusBadgeInfo(comment.status)
              return (
                <TableRow key={comment.id}>
                  {/* Author & Comment Column - Always visible, comprehensive on mobile */}
                  <TableCell>
                    <div className="space-y-3">
                      {/* Author Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 md:h-9 md:w-9 flex-shrink-0">
                          <AvatarImage
                            src={comment.profiles?.avatar_url || `/placeholder.svg?width=36&height=36&query=avatar`}
                            alt={comment.profiles?.name || "Ismeretlen"}
                          />
                          <AvatarFallback className="text-xs">
                            {comment.profiles?.name ? comment.profiles.name.substring(0, 2).toUpperCase() : "N/A"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm md:text-base truncate">
                            {comment.profiles?.name || "Ismeretlen szerző"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {comment.profiles?.email || "-"}
                          </div>
                        </div>
                      </div>
                      
                      {/* Comment Content */}
                      <div className="pl-11 md:pl-12">
                        <p className="text-sm text-foreground line-clamp-3 md:line-clamp-2">
                          {comment.content}
                        </p>
                      </div>
                      
                      {/* Mobile Info - Post, Date, Status */}
                      <div className="flex flex-wrap items-center gap-2 pl-11 md:pl-12 lg:hidden">
                        {/* Post info on mobile */}
                        {comment.posts?.title && (
                          <div className="flex items-center text-xs text-blue-600">
                            <FileText size={10} className="mr-1" />
                            <span className="truncate max-w-32">
                              {comment.posts.title.length > 20
                                ? `${comment.posts.title.substring(0, 20)}...`
                                : comment.posts.title}
                            </span>
                          </div>
                        )}
                        
                        {/* Date on mobile */}
                        <div className="flex items-center text-xs text-muted-foreground md:hidden">
                          <Calendar size={10} className="mr-1" />
                          <span>{new Date(comment.created_at).toLocaleDateString("hu-HU")}</span>
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
                  
                  {/* Post Column - Hidden on mobile/tablet */}
                  <TableCell className="hidden lg:table-cell">
                    <a
                      href={comment.posts?.id ? `/posts/${comment.posts.id}` : "#"}
                      className="text-blue-600 hover:underline text-sm block"
                      title={comment.posts?.title || "Ismeretlen bejegyzés"}
                    >
                      {comment.posts?.title
                        ? comment.posts.title.length > 40
                          ? `${comment.posts.title.substring(0, 40)}...`
                          : comment.posts.title
                        : "Ismeretlen bejegyzés"}
                    </a>
                  </TableCell>
                  
                  {/* Date Column - Hidden on mobile */}
                  <TableCell className="hidden md:table-cell text-sm">
                    {new Date(comment.created_at).toLocaleDateString("hu-HU")}
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
                        {comment.status !== "approved" && (
                          <DropdownMenuItem onClick={() => onStatusChange(comment.id, "approved")}>
                            <CheckCircle size={14} className="mr-2 text-green-600" /> Jóváhagyás
                          </DropdownMenuItem>
                        )}
                        {comment.status !== "spam" && (
                          <DropdownMenuItem onClick={() => onStatusChange(comment.id, "spam")}>
                            <ShieldAlert size={14} className="mr-2 text-orange-500" /> Spamnek jelöl
                          </DropdownMenuItem>
                        )}
                        {comment.status !== "pending" && (comment.status === "approved" || comment.status === "spam") && (
                          <DropdownMenuItem onClick={() => onStatusChange(comment.id, "pending")}>
                            <AlertTriangle size={14} className="mr-2 text-yellow-600" /> Függőbe helyezés
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem disabled>
                          <Edit size={14} className="mr-2" /> Szerkesztés (hamarosan)
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <MessageSquare size={14} className="mr-2" /> Válasz (hamarosan)
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(comment.id)} 
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