'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { ExpenseForm } from '@/components/despesas/ExpenseForm'
import { WaterfallChart } from '@/components/graficos/WaterfallChart'
import { HorizontalBarChart } from '@/components/graficos/HorizontalBarChart'
import { TimelineChart } from '@/components/graficos/TimelineChart'
import { TransparencyTable } from '@/components/graficos/TransparencyTable'
import type { Category, CategorySummary, Expense, Project } from '@/types'

export default function GraficosPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [summaries, setSummaries] = useState<CategorySummary[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []) as Project[]
        setProjects(list)
        const savedId = localStorage.getItem('activeProjectId')
        const found = list.find((p) => p.id === savedId) ?? list[0] ?? null
        setActiveProject(found)
        setLoading(false)
      })
  }, [userId])

  const loadData = useCallback(async () => {
    if (!activeProject) return

    const [catRes, expRes] = await Promise.all([
      supabase.from('categories').select('*').eq('project_id', activeProject.id),
      supabase
        .from('expenses')
        .select('*, categories(*)')
        .eq('project_id', activeProject.id)
        .order('expense_date', { ascending: true }),
    ])

    const cats = (catRes.data ?? []) as Category[]
    const exps = (expRes.data ?? []) as Expense[]
    setCategories(cats)
    setExpenses(exps)

    const totals: Record<string, { name: string; color_hex: string; total: number }> = {}
    for (const cat of cats) {
      totals[cat.id] = { name: cat.name, color_hex: cat.color_hex, total: 0 }
    }
    for (const exp of exps) {
      if (exp.category_id && totals[exp.category_id]) {
        totals[exp.category_id].total += exp.amount
      }
    }

    const totalBudget = activeProject.total_budget
    const built = Object.values(totals)
      .filter((s) => s.total > 0)
      .sort((a, b) => b.total - a.total)
      .map((s) => ({
        ...s,
        percentage: totalBudget > 0 ? (s.total / totalBudget) * 100 : 0,
      }))
    setSummaries(built)
  }, [activeProject])

  useEffect(() => {
    loadData()
  }, [loadData])

  function handleProjectChange(p: Project) {
    setActiveProject(p)
    localStorage.setItem('activeProjectId', p.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      <Header project={activeProject} projects={projects} onProjectChange={handleProjectChange} />

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 max-w-lg mx-auto w-full space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-orange-500" />
          <h1 className="text-lg font-bold text-zinc-100">Inteligência de Dados</h1>
        </div>

        {activeProject ? (
          <>
            <WaterfallChart
              totalBudget={activeProject.total_budget}
              categorySummaries={summaries}
            />

            <TransparencyTable
              summaries={summaries}
              totalBudget={activeProject.total_budget}
            />

            <HorizontalBarChart summaries={summaries} />

            <TimelineChart expenses={expenses} />
          </>
        ) : (
          <p className="text-zinc-500 text-sm text-center py-12">
            Nenhum projeto encontrado.
          </p>
        )}
      </main>

      <BottomNav onAddExpense={() => setShowForm(true)} />

      {activeProject && (
        <ExpenseForm
          open={showForm}
          onOpenChange={setShowForm}
          projectId={activeProject.id}
          categories={categories}
          onSuccess={loadData}
        />
      )}
    </div>
  )
}
