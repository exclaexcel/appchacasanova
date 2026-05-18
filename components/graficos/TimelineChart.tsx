'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Expense } from '@/types'

interface TimelineChartProps {
  expenses: Expense[]
}

interface DayData {
  date: string
  label: string
  daily: number
  cumulative: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
      <p className="text-xs text-zinc-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold text-zinc-100">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

export function TimelineChart({ expenses }: TimelineChartProps) {
  const byDate: Record<string, number> = {}
  for (const e of expenses) {
    byDate[e.expense_date] = (byDate[e.expense_date] ?? 0) + e.amount
  }

  const sorted = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b))

  let cumulative = 0
  const data: DayData[] = sorted.map(([date, daily]) => {
    cumulative += daily
    return {
      date,
      label: formatDate(date),
      daily,
      cumulative,
    }
  })

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Linha do Tempo
      </h3>
      <Card className="bg-zinc-800/60 border-zinc-700/30">
        <CardContent className="p-4 pt-4">
          {data.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8">Nenhuma despesa ainda.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C84B31" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C84B31" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97757" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#D97757" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#A1A1AA', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: '#A1A1AA', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="cumulative"
                  name="Acumulado"
                  stroke="#C84B31"
                  strokeWidth={2}
                  fill="url(#gradCumulative)"
                />
                <Area
                  type="monotone"
                  dataKey="daily"
                  name="No dia"
                  stroke="#D97757"
                  strokeWidth={1.5}
                  fill="url(#gradDaily)"
                  strokeDasharray="4 2"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
