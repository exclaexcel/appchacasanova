'use client'

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { CategorySummary } from '@/types'

interface WaterfallChartProps {
  totalBudget: number
  categorySummaries: CategorySummary[]
}

interface WaterfallEntry {
  name: string
  base: number
  value: number
  total: number
  color: string
  isTotal?: boolean
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: WaterfallEntry }> }) {
  if (!active || !payload?.length) return null
  const entry = payload[0].payload
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{entry.name}</p>
      <p className="text-sm font-bold text-zinc-100">{formatCurrency(entry.isTotal ? entry.value : entry.value)}</p>
      {!entry.isTotal && (
        <p className="text-xs text-zinc-500 mt-0.5">Saldo após: {formatCurrency(entry.total)}</p>
      )}
    </div>
  )
}

export function WaterfallChart({ totalBudget, categorySummaries }: WaterfallChartProps) {
  const data: WaterfallEntry[] = []

  data.push({
    name: 'Orçamento',
    base: 0,
    value: totalBudget,
    total: totalBudget,
    color: '#71717A',
    isTotal: true,
  })

  let runningTotal = totalBudget
  for (const cat of categorySummaries) {
    const newTotal = runningTotal - cat.total
    data.push({
      name: cat.name.replace('Móveis e Decoração', 'Móveis'),
      base: newTotal,
      value: cat.total,
      total: newTotal,
      color: cat.color_hex,
    })
    runningTotal = newTotal
  }

  data.push({
    name: 'Saldo',
    base: 0,
    value: Math.max(runningTotal, 0),
    total: Math.max(runningTotal, 0),
    color: runningTotal >= 0 ? '#34D399' : '#F87171',
    isTotal: true,
  })

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Cascata Orçamentária
      </h3>
      <Card className="bg-zinc-800/60 border-zinc-700/30">
        <CardContent className="p-4 pt-4">
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#A1A1AA', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#A1A1AA', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Invisible base bar for non-total items */}
              <Bar dataKey="base" stackId="stack" fill="transparent" />
              <Bar dataKey="value" stackId="stack" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} opacity={entry.isTotal ? 0.9 : 0.8} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
