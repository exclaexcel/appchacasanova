'use client'

import {
  BarChart,
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

interface HorizontalBarChartProps {
  summaries: CategorySummary[]
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: CategorySummary }> }) {
  if (!active || !payload?.length) return null
  const entry = payload[0].payload
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{entry.name}</p>
      <p className="text-sm font-bold text-zinc-100">{formatCurrency(entry.total)}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{entry.percentage.toFixed(1)}% do orçamento</p>
    </div>
  )
}

export function HorizontalBarChart({ summaries }: HorizontalBarChartProps) {
  const sorted = [...summaries].sort((a, b) => b.total - a.total)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Gastos por Categoria
      </h3>
      <Card className="bg-zinc-800/60 border-zinc-700/30">
        <CardContent className="p-4 pt-4">
          {sorted.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8">Nenhuma despesa ainda.</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(sorted.length * 52, 120)}>
              <BarChart
                data={sorted}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3F3F46" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#A1A1AA', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tick={{ fill: '#D4D4D8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                  {sorted.map((entry, index) => (
                    <Cell key={index} fill={entry.color_hex} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
