import { computed, ref } from 'vue'
import {
  cashFlowSeries,
  initialBudgets,
  initialGoals,
  initialTransactions,
  openingSummary,
} from '~/data/dashboard'
import type { BudgetCategory, ChartPeriod, NewSavingsGoal, NewTransaction } from '~/types/finance'

/**
 * Estado local do protótipo. Não persiste dados nem faz requisições.
 * Os saldos iniciais incluem lançamentos anteriores à lista de transações recentes.
 * Uma futura integração pode substituir esta camada sem alterar os painéis visuais.
 */
export function useDashboard() {
  const transactions = ref(initialTransactions.map((item) => ({ ...item })))
  const budgets = ref(initialBudgets.map((item) => ({ ...item })))
  const goals = ref(initialGoals.map((item) => ({ ...item })))
  const summary = ref({ ...openingSummary })
  const search = ref('')
  const period = ref<ChartPeriod>('Month')
  const showAllTransactions = ref(false)
  const addedIncome = ref(0)
  const addedExpenses = ref(0)

  const budgetLimit = computed(() => budgets.value.reduce((total, item) => total + item.limit, 0))
  const remainingBudget = computed(() => budgetLimit.value - summary.value.expenses)
  const netCashFlow = computed(() => summary.value.income - summary.value.expenses)
  const incomeGrowth = computed(() =>
    ((summary.value.income / (openingSummary.income / 1.124) - 1) * 100).toFixed(1),
  )

  const filteredTransactions = computed(() => {
    const query = search.value.trim().toLowerCase()
    const matches = transactions.value.filter((item) =>
      `${item.name} ${item.category}`.toLowerCase().includes(query),
    )
    return query || showAllTransactions.value ? matches : matches.slice(0, 4)
  })

  const chartPoints = computed(() =>
    cashFlowSeries[period.value].map((point) => {
      const currentLabel = { Month: 'Sep', Week: 'Fri', Year: '2026' }[period.value]
      return point.label === currentLabel
        ? {
            ...point,
            income: point.income + addedIncome.value,
            expenses: point.expenses + addedExpenses.value,
          }
        : { ...point }
    }),
  )

  function addTransaction(input: NewTransaction) {
    transactions.value.unshift({ ...input, id: crypto.randomUUID() })
    if (input.kind === 'income') {
      summary.value.income += input.amount
      summary.value.balance += input.amount
      addedIncome.value += input.amount
    } else {
      summary.value.expenses += input.amount
      summary.value.balance -= input.amount
      addedExpenses.value += input.amount
      const category = budgets.value.find((item) => item.name === input.category)
      if (category) category.spent += input.amount
    }
  }

  function addGoal(input: NewSavingsGoal) {
    goals.value.push({
      ...input,
      id: crypto.randomUUID(),
      description: 'A new chapter starts here.',
      tone: 'purple',
    })
  }

  function updateBudgets(limits: Pick<BudgetCategory, 'name' | 'limit'>[]) {
    budgets.value = budgets.value.map((item) => ({
      ...item,
      limit: limits.find((limit) => limit.name === item.name)?.limit ?? item.limit,
    }))
  }

  return {
    summary,
    budgets,
    goals,
    search,
    period,
    showAllTransactions,
    budgetLimit,
    remainingBudget,
    netCashFlow,
    incomeGrowth,
    filteredTransactions,
    chartPoints,
    addedIncome,
    addedExpenses,
    addTransaction,
    addGoal,
    updateBudgets,
  }
}
