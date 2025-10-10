import * as React from 'react'
import { cn } from '@/lib/utils'

const ColorPicker = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    onValueChange?: (value: string) => void
  }
>(({ className, value, onValueChange, ...props }, ref) => {
  const [selectedColor, setSelectedColor] = React.useState<string>(value || '#000000')

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedColor(value)
    }
  }, [value])

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor)
    onValueChange?.(newColor)
  }

  return (
    <div ref={ref} className={cn('relative', className)} {...props}>
      <input
        type="color"
        value={selectedColor}
        onChange={e => handleColorChange(e.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background p-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )
})
ColorPicker.displayName = 'ColorPicker'

export { ColorPicker }
