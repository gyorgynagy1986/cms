"use client"

import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Star, CheckCircle, Clock, Eye, MessageSquare, Heart, Edit, Trash2, Copy, MoreHorizontal } from "lucide-react"
import type { Post } from "@/lib/types"

interface PostsTableProps {
  posts: Post[]
  onEdit: (post: Post) => void
  onDelete: (id: number) => void
}

export default function PostsTable({ posts, onEdit, onDelete }: PostsTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] min-w-[40px]">
                <Checkbox />
              </TableHead>
              <TableHead className="min-w-[300px]">Bejegyzés</TableHead>
              <TableHead className="min-w-[120px] hidden lg:table-cell">Szerző</TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">Státusz</TableHead>
              <TableHead className="min-w-[150px] hidden xl:table-cell">Statisztikák</TableHead>
              <TableHead className="w-[60px] hidden lg:table-cell">SEO</TableHead>
              <TableHead className="text-right min-w-[80px]">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                
                {/* Post Column - Always visible, responsive content */}
                <TableCell>
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="relative flex-shrink-0">
                      <Image
                        src={post.image || `/placeholder.svg?width=64&height=64&query=${encodeURIComponent(post.title)}`}
                        alt={post.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover"
                      />
                      {post.featured && (
                        <Star className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500" size={12} />
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm md:text-base line-clamp-1">
                        {post.title}
                      </div>
                      
                      {/* Excerpt - Hidden on mobile */}
                      <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-1 hidden md:block mt-1">
                        {post.excerpt ? post.excerpt.substring(0, 60) + "..." : ""}
                      </div>
                      
                      {/* Mobile info - Author, status, stats */}
                      <div className="flex flex-wrap items-center gap-2 mt-2 lg:hidden">
                        {/* Author on mobile */}
                        <div className="flex items-center text-xs text-gray-500">
                          <Image
                            src={post.profiles?.avatar_url || "/placeholder.svg?width=16&height=16&query=avatar"}
                            alt={post.profiles?.name || "Ismeretlen"}
                            width={16}
                            height={16}
                            className="w-4 h-4 rounded-full mr-1"
                          />
                          <span className="truncate max-w-20">
                            {post.profiles?.name || "Ismeretlen"}
                          </span>
                        </div>
                        
                        {/* Status on mobile */}
                        <Badge
                          variant={post.status === "published" ? "default" : "outline"}
                          className={`text-xs ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                          }`}
                        >
                          {post.status === "published" ? "Élő" : "Piszkozat"}
                        </Badge>
                        
                        {/* Quick stats on mobile */}
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Eye size={10} className="mr-1" />
                            {post.views > 999 ? `${Math.floor(post.views/1000)}k` : post.views}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare size={10} className="mr-1" />
                            {post.comments_count}
                          </div>
                        </div>
                      </div>
                      
                      {/* Tags - Responsive */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags && post.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                {/* Author Column - Hidden on mobile/tablet */}
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center">
                    <Image
                      src={post.profiles?.avatar_url || "/placeholder.svg?width=24&height=24&query=avatar"}
                      alt={post.profiles?.name || "Ismeretlen szerző"}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                      {post.profiles?.name || "Ismeretlen szerző"}
                    </span>
                  </div>
                </TableCell>
                
                {/* Status Column - Hidden on mobile */}
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant={post.status === "published" ? "default" : "outline"}
                    className={
                      post.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                    }
                  >
                    {post.status === "published" ? (
                      <CheckCircle size={12} className="mr-1" />
                    ) : (
                      <Clock size={12} className="mr-1" />
                    )}
                    {post.status === "published" ? "Közzétéve" : "Piszkozat"}
                  </Badge>
                </TableCell>
                
                {/* Stats Column - Hidden except on XL screens */}
                <TableCell className="text-sm text-gray-500 dark:text-gray-400 hidden xl:table-cell">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {post.views.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare size={14} className="mr-1" />
                      {post.comments_count}
                    </div>
                    <div className="flex items-center">
                      <Heart size={14} className="mr-1" />
                      {post.likes}
                    </div>
                  </div>
                </TableCell>
                
                {/* SEO Column - Hidden on mobile/tablet */}
                <TableCell className="hidden lg:table-cell">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      post.seo_score && post.seo_score >= 90
                        ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                        : post.seo_score && post.seo_score >= 70
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                          : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                    }`}
                  >
                    {post.seo_score || "-"}
                  </div>
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
                      <DropdownMenuItem onClick={() => onEdit(post)}>
                        <Edit size={14} className="mr-2" /> Szerkesztés
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy size={14} className="mr-2" /> Duplikálás
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(post.id)} 
                        className="text-red-600 hover:!text-red-600"
                      >
                        <Trash2 size={14} className="mr-2" /> Törlés
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}