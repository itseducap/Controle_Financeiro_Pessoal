<script setup lang="ts">
import { formatMoney } from '~/utils/format'
import type { Money } from '~/types/finance'

defineProps<{
  balance: Money
  income: Money
  expenses: Money
  netCashFlow: Money
  remainingBudget: Money
  incomeGrowth: string
}>()
</script>

<template>
  <section class="summary-grid" aria-label="Financial summary">
    <article class="summary-card balance-card">
      <div class="summary-label">
        <h2>Total balance</h2>
        <span>BRL</span>
      </div>
      <p class="summary-value">{{ formatMoney(balance) }}</p>
      <div class="summary-detail">
        <span class="text-green"
          >{{ netCashFlow >= 0 ? '+' : '−' }} {{ formatMoney(Math.abs(netCashFlow)) }} this
          month</span
        ><span>Across 3 accounts</span>
      </div>
    </article>
    <article class="summary-card">
      <div class="summary-label">
        <h2>Income</h2>
        <AppIcon name="arrow" class="text-green" />
      </div>
      <p class="summary-value">{{ formatMoney(income) }}</p>
      <p class="summary-detail text-green">+{{ incomeGrowth }}% <span>vs. last month</span></p>
    </article>
    <article class="summary-card">
      <div class="summary-label">
        <h2>Expenses</h2>
        <AppIcon name="arrow" class="text-peach" />
      </div>
      <p class="summary-value">{{ formatMoney(expenses) }}</p>
      <p class="summary-detail" :class="{ 'text-peach': remainingBudget < 0 }">
        {{ formatMoney(Math.abs(remainingBudget)) }}
        {{ remainingBudget >= 0 ? 'left in your budget' : 'over your budget' }}
      </p>
    </article>
  </section>
</template>
