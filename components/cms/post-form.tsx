"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import ImageSelector from "./image-selector"
import type { Post, PostFormData } from "@/lib/types"

interface PostFormProps {
  post?: Post
  onSave: (postData: PostFormData) => void
  onCancel: () => void
  defaultAuthorName?: string
}

export default function PostForm({ post, onSave, onCancel, defaultAuthorName }: PostFormProps) {
  const initialFormData: PostFormData = post
    ? {
        title: post.title,
        excerpt: post.excerpt || "",
        author: post.profiles?.name || defaultAuthorName || "Admin",
        date: post.created_at.split("T")[0],
        status: post.status,
        readTime: post.read_time || 0,
        category: post.category || "Általános",
        tags: post.tags || [],
        featured: post.featured,
        image: post.image,
        content: post.content || "",
      }
    : {
        title: "",
        excerpt: "",
        author: defaultAuthorName || "Admin",
        date: new Date().toISOString().split("T")[0],
        status: "draft",
        readTime: 5,
        category: "Általános",
        tags: [],
        featured: false,
        image: "",
        content: "",
      }

  const [formData, setFormData] = useState<PostFormData>(initialFormData)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt || "",
        author: post.profiles?.name || defaultAuthorName || "Admin",
        date: post.created_at.split("T")[0],
        status: post.status,
        readTime: post.read_time || 0,
        category: post.category || "Általános",
        tags: post.tags || [],
        featured: post.featured,
        image: post.image,
        content: post.content || "",
      })
    } else {
      setFormData(initialFormData)
    }
  }, [post, defaultAuthorName])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof PostFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value as any }))
  }

  const handleCheckboxChange = (name: keyof PostFormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const tagsArray = value ? value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "") : []
    setFormData((prev) => ({ ...prev, tags: tagsArray }))
  }

  const handleImageChange = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex-1 overflow-hidden">
        <div className={`grid gap-4 md:gap-6 py-4 px-1 ${isMobile ? 'max-h-[calc(100vh-240px)]' : 'max-h-[70vh]'} overflow-y-auto`}>
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-sm md:text-base font-medium">Cím</Label>
            <Input 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="text-sm md:text-base focus:ring-2 focus:ring-inset"
            />
          </div>
          
          {/* Excerpt */}
          <div className="grid gap-2">
            <Label htmlFor="excerpt" className="text-sm md:text-base font-medium">Kivonat</Label>
            <Textarea 
              id="excerpt" 
              name="excerpt" 
              value={formData.excerpt} 
              onChange={handleChange} 
              rows={isMobile ? 2 : 3}
              className="text-sm md:text-base resize-none focus:ring-2 focus:ring-inset"
            />
          </div>
          
          {/* Content */}
          <div className="grid gap-2">
            <Label htmlFor="content" className="text-sm md:text-base font-medium">
              Tartalom 
              <span className="text-xs text-muted-foreground ml-1">(Markdown támogatott)</span>
            </Label>
            <Textarea 
              id="content" 
              name="content" 
              value={formData.content || ""} 
              onChange={handleChange} 
              rows={isMobile ? 6 : 10}
              className="text-sm md:text-base resize-none font-mono focus:ring-2 focus:ring-inset"
            />
          </div>
          
          {/* Author and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="author" className="text-sm md:text-base font-medium">Szerző</Label>
              <Input 
                id="author" 
                name="author" 
                value={formData.author} 
                onChange={handleChange}
                className="text-sm md:text-base focus:ring-2 focus:ring-inset" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-sm md:text-base font-medium">Dátum</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                value={formData.date} 
                onChange={handleChange}
                className="text-sm md:text-base focus:ring-2 focus:ring-inset" 
              />
            </div>
          </div>
          
          {/* Status and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-sm md:text-base font-medium">Státusz</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger className="text-sm md:text-base focus:ring-2 focus:ring-inset">
                  <SelectValue placeholder="Válasszon státuszt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Közzétéve</SelectItem>
                  <SelectItem value="draft">Piszkozat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-sm md:text-base font-medium">Kategória</Label>
              <Input 
                id="category" 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="text-sm md:text-base" 
              />
            </div>
          </div>
          
          {/* Tags */}
          <div className="grid gap-2">
            <Label htmlFor="tags" className="text-sm md:text-base font-medium">
              Címkék 
              <span className="text-xs text-muted-foreground ml-1">(vesszővel elválasztva)</span>
            </Label>
            <Input 
              id="tags" 
              name="tags" 
              value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""} 
              onChange={handleTagsChange}
              placeholder="pl: technológia, innováció, webfejlesztés"
              className="text-sm md:text-base"
            />
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Image Selector */}
          <div className="grid gap-2">
            <ImageSelector
              value={formData.image || ""}
              onChange={handleImageChange}
              label="Bejegyzés képe"
            />
          </div>
          
          {/* Read Time and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="readTime" className="text-sm md:text-base font-medium">
                Olvasási idő (perc)
              </Label>
              <Input
                id="readTime"
                name="readTime"
                type="number"
                value={formData.readTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, readTime: Number.parseInt(e.target.value, 10) || 0 }))}
                min="0"
                className="text-sm md:text-base"
              />
            </div>
            <div className="flex items-center space-x-2 pt-4 md:pt-6">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleCheckboxChange("featured", Boolean(checked))}
              />
              <Label
                htmlFor="featured"
                className="text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Kiemelt bejegyzés
              </Label>
            </div>
          </div>
        </div>

        {/* Sticky Footer Buttons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4 md:mt-6 sticky bottom-0 bg-background py-3 md:py-4 border-t dark:border-gray-700">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="w-full sm:w-auto text-sm md:text-base"
          >
            Mégse
          </Button>
          <Button 
            type="submit"
            className="w-full sm:w-auto text-sm md:text-base"
          >
            {post ? "Frissítés" : "Mentés"}
          </Button>
        </div>
      </form>
    </div>
  )
}