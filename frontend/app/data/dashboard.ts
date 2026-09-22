import type {
  Account,
  BudgetCategory,
  CashFlowPoint,
  ChartPeriod,
  SavingsGoal,
  Transaction,
} from '~/types/finance'

// A referência retrata setembro de 2026. A data fixa mantém o protótipo reproduzível.
export const DEMO_DATE = '2026-09-18'
export const DEMO_MONTH = 'September 2026'
export const openingSummary = { balance: 2468000, income: 850000, expenses: 530000 }

export const initialTransactions: Transaction[] = [
  {
    id: 'freelance',
    name: 'Freelance project',
    category: 'Income',
    date: DEMO_DATE,
    kind: 'income',
    amount: 200000,
  },
  {
    id: 'market',
    name: 'Market & Co.',
    category: 'Food & groceries',
    date: DEMO_DATE,
    kind: 'expense',
    amount: 18640,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Lifestyle',
    date: '2026-09-17',
    kind: 'expense',
    amount: 3990,
  },
  {
    id: 'rent',
    name: 'Apartment rent',
    category: 'Housing',
    date: '2026-09-15',
    kind: 'expense',
    amount: 250000,
  },
  {
    id: 'salary',
    name: 'Monthly salary',
    category: 'Income',
    date: '2026-09-05',
    kind: 'income',
    amount: 650000,
  },
  {
    id: 'groceries',
    name: 'Neighborhood groceries',
    category: 'Food & groceries',
    date: '2026-09-04',
    kind: 'expense',
    amount: 29460,
  },
]

export const initialBudgets: BudgetCategory[] = [
  { name: 'Housing', spent: 290000, limit: 300000, tone: 'purple' },
  { name: 'Food & groceries', spent: 150000, limit: 200000, tone: 'green' },
  { name: 'Lifestyle', spent: 90000, limit: 150000, tone: 'peach' },
]

export const initialGoals: SavingsGoal[] = [
  {
    id: 'emergency',
    name: 'Emergency fund',
    description: 'Peace of mind, one step at a time.',
    saved: 1200000,
    target: 2000000,
    tone: 'purple',
  },
  {
    id: 'europe',
    name: 'Europe trip',
    description: 'A little closer to your next chapter.',
    saved: 450000,
    target: 1000000,
    tone: 'green',
  },
]

export const accounts: Account[] = [
  { name: 'Everyday account', description: 'Daily spending', balance: 818000, tone: 'purple' },
  { name: 'Emergency savings', description: 'Your safety net', balance: 1200000, tone: 'green' },
  { name: 'Travel savings', description: 'For the next chapter', balance: 450000, tone: 'peach' },
]

/** Séries ilustrativas independentes: Week = dias da semana; Year = totais anuais. */
export const cashFlowSeries: Record<ChartPeriod, CashFlowPoint[]> = {
  Month: [
    { label: 'Apr', income: 620000, expenses: 420000 },
    { label: 'May', income: 700000, expenses: 510000 },
    { label: 'Jun', income: 650000, expenses: 480000 },
    { label: 'Jul', income: 810000, expenses: 580000 },
    { label: 'Aug', income: 756200, expenses: 560000 },
    { label: 'Sep', income: 850000, expenses: 530000 },
  ],
  Week: [
    { label: 'Mon', income: 0, expenses: 4500 },
    { label: 'Tue', income: 0, expenses: 250000 },
    { label: 'Wed', income: 0, expenses: 9600 },
    { label: 'Thu', income: 0, expenses: 3990 },
    { label: 'Fri', income: 200000, expenses: 18640 },
    { label: 'Sat', income: 0, expenses: 0 },
    { label: 'Sun', income: 0, expenses: 0 },
  ],
  Year: [
    { label: '2022', income: 7200000, expenses: 5400000 },
    { label: '2023', income: 7800000, expenses: 5700000 },
    { label: '2024', income: 8400000, expenses: 6000000 },
    { label: '2025', income: 9000000, expenses: 6240000 },
    { label: '2026', income: 7256200, expenses: 4790000 },
  ],
}
