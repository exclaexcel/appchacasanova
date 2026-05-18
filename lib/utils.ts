import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { PaymentMethod } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function paymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    dinheiro: 'Dinheiro',
    pix: 'PIX',
    cartao_debito: 'Cartão Débito',
    cartao_credito: 'Cartão Crédito',
    boleto: 'Boleto',
    transferencia: 'Transferência',
  }
  return labels[method] ?? method
}

export const DEFAULT_CATEGORIES = [
  { name: 'Mão de Obra', color_hex: '#C84B31' },
  { name: 'Materiais Brutos', color_hex: '#7A4D2C' },
  { name: 'Acabamentos', color_hex: '#D97757' },
  { name: 'Móveis e Decoração', color_hex: '#5C3A21' },
  { name: 'Outros', color_hex: '#71717A' },
] as const
