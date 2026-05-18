'use client'

import { useState } from 'react'
import { HardHat, LogOut, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Project } from '@/types'

interface HeaderProps {
  project: Project | null
  projects: Project[]
  onProjectChange: (project: Project) => void
}

export function Header({ project, projects, onProjectChange }: HeaderProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-700/50">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <HardHat className="h-6 w-6 text-orange-500" />
          <span className="font-bold text-zinc-100 text-base">ReformaApp</span>
        </div>

        <div className="flex items-center gap-2">
          {projects.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-1.5 text-sm text-zinc-300 hover:text-zinc-100 bg-zinc-800 rounded-lg px-3 py-1.5 transition-colors"
              >
                <span className="max-w-[120px] truncate">{project?.name ?? 'Selecionar'}</span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onProjectChange(p)
                        setShowMenu(false)
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700 transition-colors"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {projects.length <= 1 && project && (
            <span className="text-sm text-zinc-400 max-w-[140px] truncate">{project.name}</span>
          )}

          <button
            onClick={handleLogout}
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
