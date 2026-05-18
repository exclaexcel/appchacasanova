'use client'

import { useState } from 'react'
import { Hammer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import type { Category, PaymentMethod } from '@/types'

interface ExpenseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  categories: Category[]
  onSuccess: () => void
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'pix', label: 'PIX' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'cartao_debito', label: 'Cartão Débito' },
  { value: 'cartao_credito', label: 'Cartão Crédito' },
  { value: 'boleto', label: 'Boleto' },
  { value: 'transferencia', label: 'Transferência' },
]

export function ExpenseForm({ open, onOpenChange, projectId, categories, onSuccess }: ExpenseFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    description: '',
    amount: '',
    expense_date: today,
    category_id: '',
    payment_method: 'pix' as PaymentMethod,
    is_paid: false,
  })

  function resetForm() {
    setForm({
      description: '',
      amount: '',
      expense_date: today,
      category_id: '',
      payment_method: 'pix',
      is_paid: false,
    })
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const amount = parseFloat(form.amount.replace(',', '.'))
    if (isNaN(amount) || amount <= 0) {
      setError('Valor inválido.')
      return
    }
    if (!form.description.trim()) {
      setError('Descrição obrigatória.')
      return
    }

    setLoading(true)
    const { error: err } = await supabase.from('expenses').insert({
      project_id: projectId,
      category_id: form.category_id || null,
      description: form.description.trim(),
      amount,
      expense_date: form.expense_date,
      payment_method: form.payment_method,
      is_paid: form.is_paid,
    })
    setLoading(false)

    if (err) {
      setError(err.message)
      return
    }

    resetForm()
    onOpenChange(false)
    onSuccess()
  }

  function handleClose() {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="mx-4 w-[calc(100%-2rem)] max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hammer className="h-5 w-5 text-orange-500" />
            Novo Lançamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Valor (R$) *</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="text-lg font-semibold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              type="text"
              placeholder="Ex: Cimento, Mão de obra pedreiro..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={form.expense_date}
                onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select
                value={form.category_id}
                onValueChange={(v) => setForm({ ...form, category_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Forma de Pagamento</Label>
            <Select
              value={form.payment_method}
              onValueChange={(v) => setForm({ ...form, payment_method: v as PaymentMethod })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 py-1">
            <Checkbox
              id="is_paid"
              checked={form.is_paid}
              onCheckedChange={(checked) => setForm({ ...form, is_paid: checked === true })}
            />
            <Label htmlFor="is_paid" className="cursor-pointer">
              Já está pago
            </Label>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
