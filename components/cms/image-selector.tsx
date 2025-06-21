"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Image as ImageIcon, Upload, X } from "lucide-react"
import { listMediaFilesAction } from "@/lib/actions/media"
import type { MediaFile } from "@/lib/types"

interface ImageSelectorProps {
  value: string
  onChange: (imageUrl: string) => void
  label?: string
}

export default function ImageSelector({ value, onChange, label = "Kép" }: ImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [manualUrl, setManualUrl] = useState(value || "")

  const loadMediaFiles = async () => {
    setIsLoading(true)
    try {
      const result = await listMediaFilesAction("")
      if (result.success) {
        // Csak képeket szűrünk
        const imageFiles = result.files.filter(file => 
          file.type?.startsWith("image/") || 
          file.name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
        )
        setMediaFiles(imageFiles)
      }
    } catch (error) {
      console.error("Error loading media files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadMediaFiles()
    }
  }, [isOpen])

  useEffect(() => {
    setManualUrl(value || "")
  }, [value])

  const handleSelectImage = (imageUrl: string) => {
    onChange(imageUrl)
    setIsOpen(false)
  }

  const handleManualUrlChange = (url: string) => {
    setManualUrl(url)
    onChange(url)
  }

  const handleClearImage = () => {
    onChange("")
    setManualUrl("")
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="image">{label}</Label>
      
      <div className="flex gap-2">
        <Input
          id="image"
          value={manualUrl}
          onChange={(e) => handleManualUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg vagy válassz a médiatárból"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
        >
          <ImageIcon size={16} className="mr-2" />
          Tallózás
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClearImage}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      {/* Kép előnézet */}
      {value && (
        <div className="mt-2">
          <img
            src={value}
            alt="Kiválasztott kép"
            className="max-w-full h-32 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Médiatár dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Kép kiválasztása a médiatárból</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-1">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Képek betöltése...</p>
                </div>
              </div>
            ) : mediaFiles.length === 0 ? (
              <div className="text-center p-8">
                <ImageIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nincsenek képek</h3>
                <p className="text-muted-foreground mb-4">Még nem töltött fel képeket a médiatárba.</p>
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    // Itt lehetne megnyitni a média oldalt
                    window.open('/media', '_blank')
                  }}
                >
                  <Upload size={16} className="mr-2" />
                  Képek feltöltése
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaFiles.map((file) => (
                  <Card 
                    key={file.id} 
                    className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => file.url && handleSelectImage(file.url)}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-square relative mb-2">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover rounded"
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        {file.size && (
                          <Badge variant="secondary" className="text-xs">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Bezárás
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}