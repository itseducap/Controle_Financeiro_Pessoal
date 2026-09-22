<script setup lang="ts">
import { ref } from 'vue'
import { DEMO_DATE } from '~/data/dashboard'
import type { ExpenseCategory, NewTransaction, TransactionKind } from '~/types/finance'

const emit = defineEmits<{ save: [transaction: NewTransaction]; cancel: [] }>()
const name = ref('')
const amount = ref<number | string>('')
const kind = ref<TransactionKind>('expense')
const category = ref<ExpenseCategory>('Food & groceries')
const categories: ExpenseCategory[] = ['Housing', 'Food & groceries', 'Lifestyle']
const error = ref('')

function submit() {
  const cents = Math.round(Number(amount.value) * 100)
  if (!name.value.trim() || !Number.isSafeInteger(cents) || cents <= 0 || cents > 100000000) {
    error.value = 'Enter a name and an amount between R$ 0.01 and R$ 1,000,000.'
    return
  }
  emit('save', {
    name: name.value.trim(),
    amount: cents,
    kind: kind.value,
    category: kind.value === 'income' ? 'Income' : category.value,
    date: DEMO_DATE,
  })
}
</script>

<template>
  <form class="demo-form" @submit.prevent="submit">
    <p class="form-note">Try it out. This transaction is kept only until you reload the page.</p>
    <label
      >Description<input
        v-model="name"
        required
        maxlength="60"
        placeholder="e.g. Coffee with friends"
        autocomplete="off"
    /></label>
    <div class="form-columns">
      <label
        >Type<select v-model="kind">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select></label
      ><label
        >Amount (BRL)<input
          v-model="amount"
          type="number"
          required
          min="0.01"
          max="1000000"
          step="0.01"
          placeholder="0.00"
          inputmode="decimal"
      /></label>
    </div>
    <label v-if="kind === 'expense'"
      >Category<select v-model="category">
        <option v-for="option in categories" :key="option">{{ option }}</option>
      </select></label
    >
    <p class="form-note">Demo date: September 18, 2026 · Everyday account</p>
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    <div class="form-actions">
      <button type="button" class="secondary-button" @click="emit('cancel')">Cancel</button
      ><button type="submit" class="primary-button">Add transaction</button>
    </div>
  </form>
</template>
