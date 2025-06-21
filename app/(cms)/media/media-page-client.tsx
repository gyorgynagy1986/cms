"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { MediaFile } from "@/lib/types"
import MediaGrid from "@/components/cms/media-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Filter, Layers, BarChart3, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { uploadMediaFileAction, deleteMediaFileAction, listMediaFilesAction } from "@/lib/actions/media"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface MediaPageClientProps {
  initialMediaFiles: MediaFile[]
  errorMessage?: string
}

export default function MediaPageClient({ initialMediaFiles, errorMessage }: MediaPageClientProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(initialMediaFiles)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Frissíti a fájllistát a szerverről
  const refreshMediaFiles = async () => {
    setIsRefreshing(true)
    try {
      const result = await listMediaFilesAction("")
      if (result.success) {
        setMediaFiles(result.files || [])
      } else {
        toast({ 
          title: "Frissítési hiba", 
          description: result.message, 
          variant: "destructive" 
        })
      }
    } catch (error) {
      toast({ 
        title: "Frissítési hiba", 
        description: "Nem sikerült frissíteni a fájllistát", 
        variant: "destructive" 
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({ title: "Nincs fájl kiválasztva", variant: "destructive" })
      return
    }
    
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const result = await uploadMediaFileAction(formData)
      
      if (result.success) {
        toast({ title: "Sikeres feltöltés", description: result.message })
        
        // Optimistic update: azonnal frissítjük a listát
        await refreshMediaFiles()
      } else {
        toast({ title: "Feltöltési hiba", description: result.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ 
        title: "Feltöltési hiba", 
        description: "Váratlan hiba történt", 
        variant: "destructive" 
      })
    } finally {
      setIsUploading(false)
      setShowUploadDialog(false)
      setSelectedFile(null)
    }
  }

  const handleDelete = async (filePath: string | undefined) => {
    if (!filePath) {
      toast({ title: "Hiba", description: "Nincs megadva a fájl elérési útja.", variant: "destructive" })
      return
    }

    if (!window.confirm(`Biztosan törölni szeretné a "${filePath}" fájlt?`)) {
      return
    }

    // Optimistic update: azonnal eltávolítjuk a UI-ból
    const originalFiles = [...mediaFiles]
    const optimisticFiles = mediaFiles.filter(file => file.path !== filePath)
    setMediaFiles(optimisticFiles)

    try {
      const result = await deleteMediaFileAction(filePath)
      
      if (result.success) {
        toast({ title: "Sikeres törlés", description: result.message })
        // A fájl már el van távolítva a UI-ból, csak frissítjük a listát a szerverről
        await refreshMediaFiles()
      } else {
        // Ha a törlés sikertelen, visszaállítjuk az eredeti listát
        setMediaFiles(originalFiles)
        toast({ title: "Törlési hiba", description: result.message, variant: "destructive" })
      }
    } catch (error) {
      // Ha hiba történt, visszaállítjuk az eredeti listát
      setMediaFiles(originalFiles)
      toast({ 
        title: "Törlési hiba", 
        description: "Váratlan hiba történt", 
        variant: "destructive" 
      })
    }
  }

  if (errorMessage) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg md:text-xl">Hiba a médiafájlok betöltésekor</CardTitle>
            <CardDescription className="text-sm md:text-base">{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm md:text-base mb-4">
              Kérjük, próbálja meg később, vagy vegye fel a kapcsolatot a rendszergazdával.
            </p>
            <Button onClick={refreshMediaFiles}>
              <RefreshCw size={16} className="mr-2" />
              Újrapróbálás
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Actions - Mobile Optimized */}
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
        {/* Left Side - Actions */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <Button onClick={() => setShowUploadDialog(true)} className="flex-1 sm:flex-none">
            <Upload size={16} className="mr-2" />
            <span className="hidden sm:inline">Fájl feltöltés</span>
            <span className="sm:hidden">Feltöltés</span>
          </Button>
          
          <Button variant="outline" disabled className="flex-1 sm:flex-none">
            <Filter size={16} className="mr-2" />
            <span className="hidden sm:inline">Szűrés</span>
            <span className="sm:hidden">Szűrő</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={refreshMediaFiles}
            disabled={isRefreshing}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Frissítés</span>
            <span className="sm:hidden">Frissít</span>
          </Button>
        </div>

        {/* Right Side - View Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground md:hidden">
            {mediaFiles.length} fájl
          </span>
          
          {!isMobile && (
            <div className="flex items-center space-x-1 p-1 bg-muted rounded-lg ml-auto">
              <Button
                size="icon"
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                onClick={() => setViewMode("grid")}
                title="Rács nézet"
              >
                <Layers size={16} />
              </Button>
              <Button
                size="icon"
                variant={viewMode === "list" ? "secondary" : "ghost"}
                onClick={() => setViewMode("list")}
                title="Lista nézet (hamarosan)"
                disabled
              >
                <BarChart3 size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* File Count - Desktop only */}
      {!isMobile && (
        <div className="flex justify-end">
          <span className="text-sm text-muted-foreground">
            {mediaFiles.length} fájl
          </span>
        </div>
      )}

      {/* Content Area */}
      {mediaFiles.length > 0 ? (
        <MediaGrid media={mediaFiles} onDelete={handleDelete} />
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg md:text-xl">Nincsenek médiafájlok</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Még nem töltött fel egyetlen fájlt sem, vagy a könyvtár üres.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload size={16} className="mr-2" />
              Első fájl feltöltése
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog - Mobile Optimized */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className={isMobile ? "w-[95vw] max-w-[95vw]" : ""}>
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">Fájl feltöltése</DialogTitle>
            <DialogDescription className="text-sm md:text-base">
              Válasszon ki egy fájlt a feltöltéshez a médiakönyvtárba.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file-upload" className="text-sm md:text-base">
                Fájl kiválasztása
              </Label>
              <Input 
                id="file-upload" 
                type="file" 
                onChange={handleFileChange}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                className="text-sm md:text-base"
              />
            </div>
            {selectedFile && (
              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                <div className="font-medium">Kiválasztva:</div>
                <div className="truncate">{selectedFile.name}</div>
                <div className="text-xs">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Mégse
              </Button>
            </DialogClose>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Feltöltés...
                </>
              ) : (
                "Feltöltés"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}