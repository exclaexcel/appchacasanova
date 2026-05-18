'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, BarChart3, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  onAddExpense: () => void
}

export function BottomNav({ onAddExpense }: BottomNavProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/despesas', icon: List, label: 'Despesas' },
    null, // placeholder for center button
    { href: '/graficos', icon: BarChart3, label: 'Gráficos' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 border-t border-zinc-700/50 safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item, i) => {
          if (item === null) {
            return (
              <button
                key="add"
                onClick={onAddExpense}
                className="flex flex-col items-center justify-center -mt-6"
                aria-label="Novo lançamento"
              >
                <div className="w-14 h-14 rounded-full bg-orange-700 hover:bg-orange-600 active:bg-orange-800 transition-colors flex items-center justify-center shadow-lg shadow-orange-900/50">
                  <Plus className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
              </button>
            )
          }

          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors',
                isActive ? 'text-orange-400' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
