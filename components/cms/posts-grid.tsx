"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Star, Eye, MessageSquare, Heart, Edit, Trash2, Copy, MoreHorizontal, Calendar, User } from "lucide-react"
import type { Post } from "@/lib/types"

interface PostsGridProps {
  posts: Post[]
  onEdit: (post: Post) => void
  onDelete: (id: number) => void
}

export default function PostsGrid({ posts, onEdit, onDelete }: PostsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden flex flex-col h-full">
          <CardHeader className="p-0 relative">
            <div className="relative w-full h-40 sm:h-48">
              <Image
                src={post.image || `/placeholder.svg?width=400&height=250&query=${encodeURIComponent(post.title)}`}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            
            {/* Top badges - Responsive positioning */}
            <div className="absolute top-2 left-2 right-2 flex justify-between">
              {post.featured && (
                <Badge className="bg-yellow-500 text-white text-xs">
                  <Star size={10} className="mr-1 fill-white" /> 
                  <span className="hidden sm:inline">Kiemelt</span>
                  <span className="sm:hidden">★</span>
                </Badge>
              )}
              
              <Badge
                className={`text-xs ${
                  post.status === "published" ? "bg-green-500" : "bg-yellow-500"
                } text-white ml-auto`}
              >
                {post.status === "published" ? "Élő" : "Piszkozat"}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-3 md:p-4 flex-grow">
            {/* Category and SEO Score */}
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-xs">
                {post.category || "Nincs kategória"}
              </Badge>
              <div
                className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  post.seo_score && post.seo_score >= 90
                    ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                    : post.seo_score && post.seo_score >= 70
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                      : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                }`}
              >
                {post.seo_score || "-"}
              </div>
            </div>
            
            {/* Title - Responsive sizing */}
            <h3 className="text-sm md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-tight">
              {post.title}
            </h3>
            
            {/* Excerpt - Hidden on very small screens */}
            <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mb-3 line-clamp-2 hidden sm:block">
              {post.excerpt || "Nincs kivonat."}
            </p>
            
            {/* Tags - Responsive layout */}
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {post.tags && post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
            
            {/* Author and Date - Mobile optimized */}
            <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center">
                <User size={12} className="mr-1 sm:hidden" />
                <Image
                  src={post.profiles?.avatar_url || "/placeholder.svg?width=20&height=20&query=avatar"}
                  alt={post.profiles?.name || "Ismeretlen szerző"}
                  width={16}
                  height={16}
                  className="w-4 h-4 rounded-full mr-2 hidden sm:inline"
                />
                <span className="truncate">
                  {post.profiles?.name || "Ismeretlen szerző"}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar size={12} className="mr-1 sm:hidden" />
                <span>{new Date(post.created_at).toLocaleDateString("hu-HU")}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-3 md:p-4 flex items-center justify-between mt-auto border-t dark:border-gray-700">
            {/* Stats - Responsive layout */}
            <div className="grid grid-cols-3 gap-1 md:gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center sm:justify-start">
                <Eye size={12} className="mr-1" />
                <span className="hidden sm:inline">{post.views}</span>
                <span className="sm:hidden">{post.views > 999 ? `${Math.floor(post.views/1000)}k` : post.views}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <MessageSquare size={12} className="mr-1" />
                <span>{post.comments_count}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <Heart size={12} className="mr-1" />
                <span className="hidden sm:inline">{post.likes}</span>
                <span className="sm:hidden">{post.likes > 999 ? `${Math.floor(post.likes/1000)}k` : post.likes}</span>
              </div>
            </div>
            
            {/* Actions Dropdown */}
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
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}