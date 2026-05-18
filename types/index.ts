export type PaymentMethod =
  | 'dinheiro'
  | 'pix'
  | 'cartao_debito'
  | 'cartao_credito'
  | 'boleto'
  | 'transferencia'

export type CategoryName =
  | 'Mão de Obra'
  | 'Materiais Brutos'
  | 'Acabamentos'
  | 'Móveis e Decoração'
  | 'Outros'

export interface Project {
  id: string
  user_id: string
  name: string
  total_budget: number
  created_at: string
}

export interface Category {
  id: string
  project_id: string
  name: string
  color_hex: string
}

export interface Expense {
  id: string
  project_id: string
  category_id: string | null
  description: string
  amount: number
  expense_date: string
  payment_method: PaymentMethod
  is_paid: boolean
  receipt_url: string | null
  created_at: string
  categories?: Category | null
}

export interface KPIData {
  total_budget: number
  total_committed: number
  total_paid: number
  total_pending: number
}

export interface CategorySummary {
  name: string
  color_hex: string
  total: number
  percentage: number
}
