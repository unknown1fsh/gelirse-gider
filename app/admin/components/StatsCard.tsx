'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  gradient?: string
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  gradient = 'from-blue-500 to-cyan-600',
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-700">{title}</h3>
        {icon && (
          <div className={cn('p-2 rounded-lg bg-gradient-to-br shadow-md', gradient)}>
            <div className="h-5 w-5 text-white">{icon}</div>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-800 mb-1">{value}</div>
      {subtitle && (
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <span>{subtitle}</span>
        </div>
      )}
      {trend && (
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <span
            className={cn('font-semibold', trend.isPositive ? 'text-green-600' : 'text-red-600')}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-slate-500">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
