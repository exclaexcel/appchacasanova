'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { KPICards } from '@/components/home/KPICards'
import { RecentExpenses } from '@/components/home/RecentExpenses'
import { ExpenseForm } from '@/components/despesas/ExpenseForm'
import { ProjectSetup } from '@/components/projects/ProjectSetup'
import type { Category, Expense, KPIData, Project } from '@/types'

export default function HomePage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([])
  const [kpi, setKpi] = useState<KPIData>({ total_budget: 0, total_committed: 0, total_paid: 0, total_pending: 0 })
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    loadProjects()
  }, [userId])

  async function loadProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId!)
      .order('created_at', { ascending: false })

    const list = (data ?? []) as Project[]
    setProjects(list)

    const savedId = typeof window !== 'undefined' ? localStorage.getItem('activeProjectId') : null
    const found = list.find((p) => p.id === savedId) ?? list[0] ?? null
    setActiveProject(found)
    setLoading(false)
  }

  const loadProjectData = useCallback(async () => {
    if (!activeProject) return

    const [catRes, expRes] = await Promise.all([
      supabase.from('categories').select('*').eq('project_id', activeProject.id),
      supabase
        .from('expenses')
        .select('*, categories(*)')
        .eq('project_id', activeProject.id)
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false }),
    ])

    const cats = (catRes.data ?? []) as Category[]
    const exps = (expRes.data ?? []) as Expense[]

    setCategories(cats)
    setRecentExpenses(exps.slice(0, 5))

    const committed = exps.reduce((s, e) => s + e.amount, 0)
    const paid = exps.filter((e) => e.is_paid).reduce((s, e) => s + e.amount, 0)
    setKpi({
      total_budget: activeProject.total_budget,
      total_committed: committed,
      total_paid: paid,
      total_pending: committed - paid,
    })
  }, [activeProject])

  useEffect(() => {
    loadProjectData()
  }, [loadProjectData])

  function handleProjectChange(p: Project) {
    setActiveProject(p)
    localStorage.setItem('activeProjectId', p.id)
  }

  function handleProjectCreated(p: Project) {
    setProjects([p])
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

  if (!loading && projects.length === 0 && userId) {
    return <ProjectSetup userId={userId} onProjectCreated={handleProjectCreated} />
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      <Header
        project={activeProject}
        projects={projects}
        onProjectChange={handleProjectChange}
      />

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 max-w-lg mx-auto w-full space-y-5">
        <div>
          <h1 className="text-lg font-bold text-zinc-100">Resumo da Obra</h1>
          {activeProject && (
            <p className="text-xs text-zinc-500 mt-0.5">{activeProject.name}</p>
          )}
        </div>

        <KPICards data={kpi} />
        <RecentExpenses expenses={recentExpenses} />
      </main>

      <BottomNav onAddExpense={() => setShowExpenseForm(true)} />

      {activeProject && (
        <ExpenseForm
          open={showExpenseForm}
          onOpenChange={setShowExpenseForm}
          projectId={activeProject.id}
          categories={categories}
          onSuccess={loadProjectData}
        />
      )}
    </div>
  )
}
