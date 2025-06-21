"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Download, Trash2, MoreHorizontal, Video, FileText, ImageIcon, LinkIcon, Play } from "lucide-react"
import type { MediaFile } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"

interface MediaGridProps {
  media: MediaFile[]
  onDelete: (filePath: string | undefined) => void
}

export default function MediaGrid({ media, onDelete }: MediaGridProps) {
  const { toast } = useToast()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const formatFileSize = (bytes?: number) => {
    if (bytes === undefined) return "N/A"
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return isMobile 
      ? date.toLocaleDateString("hu-HU", { month: "short", day: "numeric" })
      : date.toLocaleDateString("hu-HU")
  }

  const handleCopyLink = (url?: string) => {
    if (url) {
      navigator.clipboard.writeText(url)
      toast({ title: "Link másolva", description: "A fájl URL-je a vágólapra került." })
    } else {
      toast({ title: "Hiba", description: "Nincs elérhető URL a másoláshoz.", variant: "destructive" })
    }
  }

  const getFileIcon = (file: MediaFile) => {
    if (file.type?.startsWith("video/")) {
      return <Video size={isMobile ? 32 : 48} />
    } else if (file.type?.startsWith("application/pdf") || file.type?.startsWith("text/")) {
      return <FileText size={isMobile ? 32 : 48} />
    } else {
      return <ImageIcon size={isMobile ? 32 : 48} />
    }
  }

  const isVideoFile = (file: MediaFile) => {
    return file.type?.startsWith("video/")
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
      {media.map((file) => (
        <Card key={file.path || file.name} className="overflow-hidden flex flex-col group">
          {/* Preview Area */}
          <div className="aspect-square bg-muted flex items-center justify-center relative">
            {file.thumbnail ? (
              <>
                <Image
                  src={file.thumbnail}
                  alt={file.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  className="object-cover"
                />
                {/* Video Play Overlay */}
                {isVideoFile(file) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/60 rounded-full p-2 md:p-3">
                      <Play size={isMobile ? 16 : 24} className="text-white fill-white ml-1" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground">
                {getFileIcon(file)}
              </div>
            )}
            
            {/* Hover Overlay - Desktop only */}
            {!isMobile && file.url && (
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(file.url, "_blank")}
                  className="bg-white/90 hover:bg-white text-black"
                >
                  <Eye size={14} className="mr-2" /> 
                  <span className="hidden lg:inline">Megtekintés</span>
                  <span className="lg:hidden">Nézet</span>
                </Button>
              </div>
            )}
          </div>
          
          {/* Content */}
          <CardContent className="p-2 md:p-3 flex-grow">
            <h4 
              className="font-medium text-foreground text-xs md:text-sm line-clamp-2 mb-1" 
              title={file.name}
            >
              {file.name}
            </h4>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate flex-1 mr-1">{formatFileSize(file.size)}</span>
              <span className="whitespace-nowrap">{formatDate(file.created_at)}</span>
            </div>
          </CardContent>
          
          {/* Footer */}
          <CardFooter className="p-2 flex items-center justify-between border-t">
            {/* Mobile Quick Actions */}
            {isMobile && file.url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(file.url, "_blank")}
                className="flex-1 text-xs"
              >
                <Eye size={12} className="mr-1" />
                Nézet
              </Button>
            )}
            
            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                  <MoreHorizontal size={14} />
                  <span className="sr-only">Műveletek</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {file.url && (
                  <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}>
                    <Eye size={14} className="mr-2" /> Megtekintés
                  </DropdownMenuItem>
                )}
                {file.url && (
                  <DropdownMenuItem asChild>
                    <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                      <Download size={14} className="mr-2" /> Letöltés
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleCopyLink(file.url)}>
                  <LinkIcon size={14} className="mr-2" /> Link másolása
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(file.path)} 
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