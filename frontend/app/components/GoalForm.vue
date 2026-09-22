<script setup lang="ts">
import { ref } from 'vue'
import type { NewSavingsGoal } from '~/types/finance'

const emit = defineEmits<{ save: [goal: NewSavingsGoal]; cancel: [] }>()
const name = ref('')
const target = ref<number | string>('')
const saved = ref<number | string>(0)
const error = ref('')

function submit() {
  const targetCents = Math.round(Number(target.value) * 100)
  const savedCents = Math.round(Number(saved.value) * 100)
  if (
    !name.value.trim() ||
    !Number.isSafeInteger(targetCents) ||
    !Number.isSafeInteger(savedCents) ||
    targetCents <= 0 ||
    savedCents < 0 ||
    savedCents > targetCents
  ) {
    error.value = 'Enter a name and a positive target. Savings must be between zero and the target.'
    return
  }
  emit('save', { name: name.value.trim(), target: targetCents, saved: savedCents })
}
</script>

<template>
  <form class="demo-form" @submit.prevent="submit">
    <p class="form-note">Give your next chapter a name. Demo goals reset when you reload.</p>
    <label
      >Goal name<input v-model="name" required maxlength="45" placeholder="e.g. A new home"
    /></label>
    <div class="form-columns">
      <label
        >Target (BRL)<input
          v-model="target"
          type="number"
          min="0.01"
          max="100000000"
          step="0.01"
          required
          placeholder="0.00" /></label
      ><label
        >Already saved (BRL)<input
          v-model="saved"
          type="number"
          min="0"
          :max="Number(target) || 100000000"
          step="0.01"
          required
      /></label>
    </div>
    <p v-if="error" role="alert" class="form-error">{{ error }}</p>
    <div class="form-actions">
      <button type="button" class="secondary-button" @click="emit('cancel')">Cancel</button
      ><button type="submit" class="primary-button">Create goal</button>
    </div>
  </form>
</template>
