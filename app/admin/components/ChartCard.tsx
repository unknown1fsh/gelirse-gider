'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartCardProps {
  title: string
  description?: string
  icon?: ReactNode
  gradient?: string
  children: ReactNode
  className?: string
}

export default function ChartCard({
  title,
  description,
  icon,
  gradient = 'from-indigo-500 to-purple-600',
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn('border-0 shadow-lg bg-white/80 backdrop-blur-sm', className)}>
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-slate-800">
          {icon && (
            <div className={cn('p-2 rounded-lg bg-gradient-to-br shadow-md', gradient)}>
              <div className="h-5 w-5 text-white">{icon}</div>
            </div>
          )}
          {title}
        </CardTitle>
        {description && <CardDescription className="text-slate-600">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}
