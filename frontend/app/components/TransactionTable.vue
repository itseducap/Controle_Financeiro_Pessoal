<script setup lang="ts">
import { formatDate, formatMoney } from '~/utils/format'
import type { Transaction } from '~/types/finance'

defineProps<{ transactions: Transaction[]; expanded: boolean; searching: boolean }>()
const emit = defineEmits<{ toggleAll: [] }>()
</script>

<template>
  <DashboardPanel
    id="transactions"
    title="Recent transactions"
    heading-id="transactions-heading"
    class="transactions-panel"
  >
    <template #action
      ><button class="text-button" :disabled="searching" @click="emit('toggleAll')">
        {{ expanded ? 'Show less' : 'View all' }}
      </button></template
    >
    <div class="table-scroll">
      <table>
        <caption class="sr-only">
          {{
            searching ? 'Search results' : 'Recent transactions'
          }}, all amounts in BRL
        </caption>
        <thead>
          <tr>
            <th scope="col">Transaction</th>
            <th scope="col">Category</th>
            <th scope="col">Date</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>
              <div class="transaction-name">
                <span
                  class="transaction-avatar"
                  :class="
                    transaction.kind === 'income'
                      ? 'text-green'
                      : transaction.category === 'Lifestyle'
                        ? 'text-peach'
                        : 'text-purple'
                  "
                  >{{ transaction.name.charAt(0) }}</span
                ><span>{{ transaction.name }}</span>
              </div>
            </td>
            <td>{{ transaction.category }}</td>
            <td>
              <time :datetime="transaction.date">{{ formatDate(transaction.date) }}</time>
            </td>
            <td class="transaction-amount" :class="{ 'text-green': transaction.kind === 'income' }">
              {{ transaction.kind === 'income' ? '+' : '−' }} {{ formatMoney(transaction.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!transactions.length" class="empty-state" role="status">
      No transactions found. Try another name or category.
    </p>
  </DashboardPanel>
</template>
