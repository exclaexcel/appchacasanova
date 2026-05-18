import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { CategorySummary } from '@/types'

interface TransparencyTableProps {
  summaries: CategorySummary[]
  totalBudget: number
}

export function TransparencyTable({ summaries, totalBudget }: TransparencyTableProps) {
  const totalSpent = summaries.reduce((sum, s) => sum + s.total, 0)

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Tabela de Transparência
      </h3>
      <Card className="bg-zinc-800/60 border-zinc-700/30 overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700/50 bg-zinc-800">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Peso
                </th>
              </tr>
            </thead>
            <tbody>
              {summaries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-zinc-500 text-xs">
                    Nenhuma despesa cadastrada.
                  </td>
                </tr>
              ) : (
                summaries.map((s, i) => (
                  <tr
                    key={s.name}
                    className={`border-b border-zinc-700/30 ${i % 2 === 0 ? '' : 'bg-zinc-800/40'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: s.color_hex }}
                        />
                        <span className="text-zinc-200 text-xs font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-100 text-xs font-semibold tabular-nums">
                      {formatCurrency(s.total)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-zinc-400 tabular-nums">
                        {totalBudget > 0 ? ((s.total / totalBudget) * 100).toFixed(1) : '0.0'}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {summaries.length > 0 && (
              <tfoot>
                <tr className="border-t border-zinc-600 bg-zinc-700/20">
                  <td className="px-4 py-3 text-xs font-bold text-zinc-300">Total</td>
                  <td className="px-4 py-3 text-right text-xs font-bold text-zinc-100 tabular-nums">
                    {formatCurrency(totalSpent)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-bold text-zinc-300 tabular-nums">
                    {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : '0.0'}%
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
