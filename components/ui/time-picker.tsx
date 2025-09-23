import * as React from "react"
import { cn } from "@/lib/utils"

const TimePicker = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    onValueChange?: (value: string) => void
  }
>(({ className, value, onValueChange, ...props }, ref) => {
  const [selectedTime, setSelectedTime] = React.useState<string>(value || '')

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedTime(value)
    }
  }, [value])

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime)
    onValueChange?.(newTime)
  }

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      {...props}
    >
      <input
        type="time"
        value={selectedTime}
        onChange={(e) => handleTimeChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )
})
TimePicker.displayName = "TimePicker"

export { TimePicker }
