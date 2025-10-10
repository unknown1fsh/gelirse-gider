import * as React from 'react'
import { cn } from '@/lib/utils'

const VideoUpload = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    onVideoSelect?: (file: File) => void
    preview?: string
  }
>(({ className, onVideoSelect, preview, ...props }, ref) => {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [videoPreview, setVideoPreview] = React.useState<string | null>(preview || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      onVideoSelect?.(file)

      // Preview oluştur
      const reader = new FileReader()
      reader.onload = e => {
        setVideoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('video/')) {
        onVideoSelect?.(file)

        // Preview oluştur
        const reader = new FileReader()
        reader.onload = e => {
          setVideoPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  return (
    <div
      ref={ref}
      className={cn('relative', className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...props}
    >
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className={cn(
          'flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/80',
          isDragOver && 'border-primary bg-primary/10'
        )}
      >
        {videoPreview ? (
          <div className="relative w-full h-full">
            <video src={videoPreview} className="w-full h-full object-cover rounded-lg" controls />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">Değiştir</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span>Video seçin veya buraya sürükleyin</span>
            <span className="text-xs text-muted-foreground/70">
              MP4, AVI, MOV formatları desteklenir
            </span>
          </div>
        )}
      </div>
    </div>
  )
})
VideoUpload.displayName = 'VideoUpload'

export { VideoUpload }
