<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { accounts, DEMO_MONTH } from '~/data/dashboard'
import { useDashboard } from '~/composables/useDashboard'
import { formatMoney } from '~/utils/format'
import type { BudgetCategory, NewSavingsGoal, NewTransaction } from '~/types/finance'

type Modal = 'transaction' | 'goal' | 'budget' | 'accounts' | 'notifications' | 'settings'
const modal = ref<Modal | null>(null)
const mobileOpen = ref(false)
const activeSection = ref('overview')
const toast = ref('')
let toastTimeout: ReturnType<typeof setTimeout> | undefined
const modalTitles: Record<Modal, string> = {
  transaction: 'Add transaction',
  goal: 'New savings goal',
  budget: 'Manage monthly budget',
  accounts: 'Your accounts',
  notifications: 'Notifications',
  settings: 'Workspace settings',
}

const {
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
} = useDashboard()
const displayedAccounts = computed(() =>
  accounts.map((account, index) => ({
    ...account,
    balance: account.balance + (index === 0 ? addedIncome.value - addedExpenses.value : 0),
  })),
)

function navigate(section: string) {
  mobileOpen.value = false
  if (section === 'accounts') {
    modal.value = 'accounts'
    return
  }
  activeSection.value = section
  if (section === 'transactions') showAllTransactions.value = true
  document.getElementById(section)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  })
}

function confirmAction(message: string) {
  modal.value = null
  toast.value = message
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toast.value = ''
  }, 4500)
}

function openSettings() {
  modal.value = 'settings'
  mobileOpen.value = false
}

function saveTransaction(transaction: NewTransaction) {
  addTransaction(transaction)
  search.value = ''
  confirmAction('Transaction added to this demo session.')
}
function saveGoal(goal: NewSavingsGoal) {
  addGoal(goal)
  confirmAction('Savings goal created for this demo session.')
}
function saveBudget(limits: Pick<BudgetCategory, 'name' | 'limit'>[]) {
  updateBudgets(limits)
  confirmAction('Your demo budget has been updated.')
}
onUnmounted(() => clearTimeout(toastTimeout))
</script>

<template>
  <div class="dashboard-shell">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <AppSidebar
      :mobile-open="mobileOpen"
      :active-section="activeSection"
      @navigate="navigate"
      @close="mobileOpen = false"
      @settings="openSettings"
    />
    <main id="main-content" class="main-content">
      <AppTopbar
        v-model:search="search"
        :mobile-open="mobileOpen"
        @toggle-menu="mobileOpen = !mobileOpen"
        @notifications="modal = 'notifications'"
      />
      <section id="overview" class="page-heading" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">Your money. A clearer picture.</h1>
          <p>Welcome back, Eduardo. Here’s where you stand this month.</p>
        </div>
        <div class="heading-actions">
          <span class="month-label">{{ DEMO_MONTH }}</span
          ><button class="primary-button" @click="modal = 'transaction'">
            <AppIcon name="plus" :size="16" />Add transaction
          </button>
        </div>
      </section>
      <SummaryCards
        :balance="summary.balance"
        :income="summary.income"
        :expenses="summary.expenses"
        :net-cash-flow="netCashFlow"
        :remaining-budget="remainingBudget"
        :income-growth="incomeGrowth"
      />
      <div class="dashboard-grid">
        <CashFlowChart v-model:period="period" :points="chartPoints" :net-cash-flow="netCashFlow" />
        <MonthlyBudget
          :categories="budgets"
          :spent="summary.expenses"
          :limit="budgetLimit"
          @manage="modal = 'budget'"
        />
        <TransactionTable
          :transactions="filteredTransactions"
          :expanded="showAllTransactions"
          :searching="Boolean(search.trim())"
          @toggle-all="showAllTransactions = !showAllTransactions"
        />
        <SavingsGoals :goals="goals" @create="modal = 'goal'" />
      </div>
      <footer class="dashboard-footer">
        <span><i class="dot tone-green" />All accounts up to date</span
        ><span>Sample data · All amounts in BRL · Resets on reload</span>
      </footer>
    </main>
    <BaseModal v-if="modal" :title="modalTitles[modal]" @close="modal = null">
      <TransactionForm
        v-if="modal === 'transaction'"
        @save="saveTransaction"
        @cancel="modal = null"
      />
      <GoalForm v-else-if="modal === 'goal'" @save="saveGoal" @cancel="modal = null" />
      <BudgetForm
        v-else-if="modal === 'budget'"
        :categories="budgets"
        @save="saveBudget"
        @cancel="modal = null"
      />
      <div v-else-if="modal === 'accounts'" class="account-list">
        <p class="form-note">Illustrative balances. No bank accounts are connected.</p>
        <div v-for="account in displayedAccounts" :key="account.name" class="account-row">
          <span class="goal-icon" :class="`text-${account.tone}`"><AppIcon name="accounts" /></span>
          <div>
            <h3>{{ account.name }}</h3>
            <p>{{ account.description }}</p>
          </div>
          <strong>{{ formatMoney(account.balance) }}</strong>
        </div>
        <div class="account-total">
          <span>Total balance</span><strong>{{ formatMoney(summary.balance) }}</strong>
        </div>
      </div>
      <div v-else-if="modal === 'notifications'" class="information-content">
        <span class="goal-icon text-green"><AppIcon name="check" /></span>
        <h3>You’re all caught up.</h3>
        <p>
          Your demo workspace is ready to explore. There are no bank connections or live
          notifications in this prototype.
        </p>
      </div>
      <div v-else-if="modal === 'settings'" class="settings-content">
        <p class="form-note">Visual prototype · Personal workspace</p>
        <dl>
          <div>
            <dt>Currency</dt>
            <dd>Brazilian real (BRL)</dd>
          </div>
          <div>
            <dt>Appearance</dt>
            <dd>Orbit dark</dd>
          </div>
          <div>
            <dt>Reference month</dt>
            <dd>{{ DEMO_MONTH }}</dd>
          </div>
          <div>
            <dt>Data storage</dt>
            <dd>In memory, resets on reload</dd>
          </div>
        </dl>
        <p class="form-note">
          These settings match the original design and are fixed for this preview.
        </p>
      </div>
    </BaseModal>
    <div class="toast-region" role="status" aria-live="polite">
      <div v-if="toast" class="toast"><AppIcon name="check" :size="18" />{{ toast }}</div>
    </div>
  </div>
</template>
