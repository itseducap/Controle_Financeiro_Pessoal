<script setup lang="ts">
import { ref } from 'vue'
import type { BudgetCategory } from '~/types/finance'

const props = defineProps<{ categories: BudgetCategory[] }>()
const emit = defineEmits<{ save: [limits: Pick<BudgetCategory, 'name' | 'limit'>[]]; cancel: [] }>()
const limits = ref(props.categories.map((item) => ({ name: item.name, value: item.limit / 100 })))
const error = ref('')

function submit() {
  const values = limits.value.map((item) => ({
    name: item.name,
    limit: Math.round(Number(item.value) * 100),
  }))
  if (values.some((item) => !Number.isSafeInteger(item.limit) || item.limit <= 0)) {
    error.value = 'Each category needs a positive budget.'
    return
  }
  emit('save', values)
}
</script>

<template>
  <form class="demo-form" @submit.prevent="submit">
    <p class="form-note">
      Set your monthly limits in BRL. Changes apply to this demo session only.
    </p>
    <label v-for="limit in limits" :key="limit.name"
      >{{ limit.name
      }}<input v-model="limit.value" type="number" min="0.01" max="1000000" step="0.01" required
    /></label>
    <p v-if="error" role="alert" class="form-error">{{ error }}</p>
    <div class="form-actions">
      <button type="button" class="secondary-button" @click="emit('cancel')">Cancel</button
      ><button type="submit" class="primary-button">Save budget</button>
    </div>
  </form>
</template>
