import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'paid' | 'pending' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        {
          'bg-orange-700/20 text-orange-400 border border-orange-700/30': variant === 'default',
          'bg-emerald-700/20 text-emerald-400 border border-emerald-700/30': variant === 'paid',
          'bg-amber-700/20 text-amber-400 border border-amber-700/30': variant === 'pending',
          'border border-zinc-600 text-zinc-300 bg-transparent': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
