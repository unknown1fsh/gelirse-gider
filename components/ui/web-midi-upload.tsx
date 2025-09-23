import * as React from "react"
import { cn } from "@/lib/utils"

const WebMIDIUpload = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    onWebMIDISelect?: (file: File) => void
    accept?: string
  }
>(({ className, onWebMIDISelect, accept = ".mid,.midi,.kar", ...props }, ref) => {
  const [isDragOver, setIsDragOver] = React.useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onWebMIDISelect?.(files[0])
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
      onWebMIDISelect?.(files[0])
    }
  }

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...props}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className={cn(
          "flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/80",
          isDragOver && "border-primary bg-primary/10"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <span>WebMIDI dosyası seçin veya buraya sürükleyin</span>
          <span className="text-xs text-muted-foreground/70">
            MID, MIDI, KAR formatları desteklenir
          </span>
        </div>
      </div>
    </div>
  )
})
WebMIDIUpload.displayName = "WebMIDIUpload"

export { WebMIDIUpload }
