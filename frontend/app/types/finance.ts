/** Valores monetários são inteiros em centavos, inclusive nos dados de demonstração. */
export type Money = number
export type Tone = 'purple' | 'green' | 'peach'
export type TransactionKind = 'income' | 'expense'
export type ExpenseCategory = 'Housing' | 'Food & groceries' | 'Lifestyle'
export type Category = ExpenseCategory | 'Income'
export type ChartPeriod = 'Month' | 'Week' | 'Year'

export interface Transaction {
  id: string
  name: string
  category: Category
  date: string
  kind: TransactionKind
  amount: Money
}

export type NewTransaction = Omit<Transaction, 'id'>

export interface BudgetCategory {
  name: ExpenseCategory
  spent: Money
  limit: Money
  tone: Tone
}

export interface SavingsGoal {
  id: string
  name: string
  description: string
  saved: Money
  target: Money
  tone: Tone
}

export type NewSavingsGoal = Pick<SavingsGoal, 'name' | 'saved' | 'target'>

export interface CashFlowPoint {
  label: string
  income: Money
  expenses: Money
}

export interface Account {
  name: string
  description: string
  balance: Money
  tone: Tone
}
