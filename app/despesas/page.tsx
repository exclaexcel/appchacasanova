'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { List } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { ExpenseList } from '@/components/despesas/ExpenseList'
import { ExpenseForm } from '@/components/despesas/ExpenseForm'
import type { Category, Expense, Project } from '@/types'

export default function DespesasPage() {
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
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
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false }),
    ])
    setCategories((catRes.data ?? []) as Category[])
    setExpenses((expRes.data ?? []) as Expense[])
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

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24 max-w-lg mx-auto w-full space-y-4">
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-orange-500" />
          <h1 className="text-lg font-bold text-zinc-100">Despesas</h1>
        </div>

        {activeProject ? (
          <ExpenseList
            expenses={expenses}
            categories={categories}
            onRefresh={loadData}
          />
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
