'use client'

import { useState } from 'react'
import { Search, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, paymentMethodLabel } from '@/lib/utils'
import type { Category, Expense } from '@/types'

interface ExpenseListProps {
  expenses: Expense[]
  categories: Category[]
  onRefresh: () => void
}

export function ExpenseList({ expenses, categories, onRefresh }: ExpenseListProps) {
  const supabase = createClient()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPaid, setFilterPaid] = useState('all')

  const filtered = expenses.filter((e) => {
    const matchSearch =
      !search || e.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      filterCategory === 'all' || e.category_id === filterCategory
    const matchPaid =
      filterPaid === 'all' ||
      (filterPaid === 'paid' && e.is_paid) ||
      (filterPaid === 'pending' && !e.is_paid)
    return matchSearch && matchCategory && matchPaid
  })

  async function togglePaid(expense: Expense) {
    await supabase
      .from('expenses')
      .update({ is_paid: !expense.is_paid })
      .eq('id', expense.id)
    onRefresh()
  }

  async function deleteExpense(id: string) {
    if (!confirm('Excluir esta despesa?')) return
    await supabase.from('expenses').delete().eq('id', id)
    onRefresh()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar despesa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterPaid} onValueChange={setFilterPaid}>
            <SelectTrigger className="text-xs h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="paid">Pagos</SelectItem>
              <SelectItem value="pending">A pagar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary */}
      <div className="flex justify-between text-xs text-zinc-500 px-1">
        <span>{filtered.length} despesa{filtered.length !== 1 ? 's' : ''}</span>
        <span>
          Total: {formatCurrency(filtered.reduce((sum, e) => sum + e.amount, 0))}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="bg-zinc-800/40 border-zinc-700/30">
          <CardContent className="p-8 text-center">
            <p className="text-zinc-500 text-sm">Nenhuma despesa encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((expense) => (
            <Card key={expense.id} className="bg-zinc-800/60 border-zinc-700/30">
              <CardContent className="p-3.5">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => togglePaid(expense)}
                    className="mt-0.5 shrink-0 text-zinc-500 hover:text-emerald-400 transition-colors"
                    title={expense.is_paid ? 'Marcar como pendente' : 'Marcar como pago'}
                  >
                    {expense.is_paid ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium truncate ${expense.is_paid ? 'text-zinc-400 line-through' : 'text-zinc-100'}`}>
                        {expense.description}
                      </p>
                      <p className="text-sm font-bold text-zinc-100 tabular-nums shrink-0">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-zinc-500">{formatDate(expense.expense_date)}</span>
                        {expense.categories && (
                          <>
                            <span className="text-zinc-700">·</span>
                            <span
                              className="text-xs font-medium"
                              style={{ color: expense.categories.color_hex }}
                            >
                              {expense.categories.name}
                            </span>
                          </>
                        )}
                        <span className="text-zinc-700">·</span>
                        <span className="text-xs text-zinc-500">
                          {paymentMethodLabel(expense.payment_method)}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-1 text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
