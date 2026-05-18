import { Wallet, TrendingDown, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { KPIData } from '@/types'

interface KPICardsProps {
  data: KPIData
}

export function KPICards({ data }: KPICardsProps) {
  const cards = [
    {
      label: 'Total Orçado',
      value: data.total_budget,
      icon: Wallet,
      color: 'text-zinc-300',
      bg: 'bg-zinc-700/40',
    },
    {
      label: 'Comprometido',
      value: data.total_committed,
      icon: TrendingDown,
      color: 'text-orange-400',
      bg: 'bg-orange-900/20',
    },
    {
      label: 'Total Pago',
      value: data.total_paid,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20',
    },
    {
      label: 'A Pagar',
      value: data.total_pending,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-900/20',
    },
  ]

  const budgetUsedPercent =
    data.total_budget > 0
      ? Math.min((data.total_committed / data.total_budget) * 100, 100)
      : 0

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className={`${card.bg} border-zinc-700/30`}>
              <CardContent className="p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-zinc-800/60`}>
                    <Icon className={`h-3.5 w-3.5 ${card.color}`} />
                  </div>
                  <span className="text-xs text-zinc-400 font-medium">{card.label}</span>
                </div>
                <p className={`text-base font-bold ${card.color} tabular-nums`}>
                  {formatCurrency(card.value)}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Budget progress bar */}
      <Card className="bg-zinc-800/60 border-zinc-700/30">
        <CardContent className="p-3.5">
          <div className="flex justify-between text-xs text-zinc-400 mb-2">
            <span>Consumo do orçamento</span>
            <span className={budgetUsedPercent > 90 ? 'text-red-400 font-semibold' : 'text-zinc-300'}>
              {budgetUsedPercent.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUsedPercent > 90
                  ? 'bg-red-500'
                  : budgetUsedPercent > 70
                  ? 'bg-amber-500'
                  : 'bg-orange-500'
              }`}
              style={{ width: `${budgetUsedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-500 mt-1.5">
            <span>Comprometido: {formatCurrency(data.total_committed)}</span>
            <span>Orçado: {formatCurrency(data.total_budget)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
