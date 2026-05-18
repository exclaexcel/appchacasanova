import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, paymentMethodLabel } from '@/lib/utils'
import type { Expense } from '@/types'

interface RecentExpensesProps {
  expenses: Expense[]
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
          Últimos lançamentos
        </h2>
        <Link
          href="/despesas"
          className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
        >
          Ver todos <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {expenses.length === 0 ? (
        <Card className="bg-zinc-800/40 border-zinc-700/30">
          <CardContent className="p-8 text-center">
            <p className="text-zinc-500 text-sm">Nenhum lançamento ainda.</p>
            <p className="text-zinc-600 text-xs mt-1">Toque no + para adicionar sua primeira despesa.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense) => (
            <Card key={expense.id} className="bg-zinc-800/60 border-zinc-700/30">
              <CardContent className="p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">
                      {expense.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
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
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {paymentMethodLabel(expense.payment_method)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-zinc-100 tabular-nums">
                      {formatCurrency(expense.amount)}
                    </p>
                    <Badge variant={expense.is_paid ? 'paid' : 'pending'} className="mt-1">
                      {expense.is_paid ? 'Pago' : 'A pagar'}
                    </Badge>
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
