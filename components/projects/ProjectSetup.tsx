'use client'

import { useState } from 'react'
import { HardHat, BrickWall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_CATEGORIES } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectSetupProps {
  userId: string
  onProjectCreated: (project: Project) => void
}

export function ProjectSetup({ userId, onProjectCreated }: ProjectSetupProps) {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const totalBudget = parseFloat(budget.replace(',', '.'))
    if (isNaN(totalBudget) || totalBudget <= 0) {
      setError('Informe um orçamento válido.')
      return
    }
    if (!name.trim()) {
      setError('Dê um nome para a reforma.')
      return
    }

    setLoading(true)
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .insert({ user_id: userId, name: name.trim(), total_budget: totalBudget })
      .select()
      .single()

    if (projErr || !project) {
      setError(projErr?.message ?? 'Erro ao criar projeto.')
      setLoading(false)
      return
    }

    // Create default categories
    await supabase.from('categories').insert(
      DEFAULT_CATEGORIES.map((cat) => ({
        project_id: project.id,
        name: cat.name,
        color_hex: cat.color_hex,
      }))
    )

    setLoading(false)
    onProjectCreated(project)
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-700/20 rounded-2xl flex items-center justify-center">
              <BrickWall className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Criar sua Reforma</h1>
          <p className="text-zinc-400 text-sm mt-2">
            Configure o projeto para começar a controlar suas despesas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50">
          <div className="space-y-1.5">
            <Label htmlFor="proj-name">Nome da reforma</Label>
            <Input
              id="proj-name"
              type="text"
              placeholder="Ex: Reforma apartamento 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proj-budget">Orçamento total (R$)</Label>
            <Input
              id="proj-budget"
              type="text"
              inputMode="decimal"
              placeholder="50000,00"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            <HardHat className="h-4 w-4 mr-2" />
            {loading ? 'Criando...' : 'Começar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
