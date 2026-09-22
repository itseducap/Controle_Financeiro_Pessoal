import type { Money } from '~/types/finance'

// en-US preserva os separadores do SVG; centralizado para uma futura tradução pt-BR.
const decimalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const integerFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatMoney(cents: Money, decimals = true): string {
  return `R$ ${(decimals ? decimalFormatter : integerFormatter).format(cents / 100)}`
}

export function formatNumber(cents: Money): string {
  return integerFormatter.format(cents / 100)
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T12:00:00Z`))
}

export function percentage(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0
}

/** Limita apenas a barra visual: o percentual textual pode indicar estouro da meta. */
export function progressWidth(value: number, total: number): string {
  return `${Math.min(100, Math.max(0, percentage(value, total)))}%`
}
