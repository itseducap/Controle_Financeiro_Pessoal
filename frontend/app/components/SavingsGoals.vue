<script setup lang="ts">
import { formatMoney, formatNumber, percentage, progressWidth } from '~/utils/format'
import type { SavingsGoal } from '~/types/finance'

defineProps<{ goals: SavingsGoal[] }>()
const emit = defineEmits<{ create: [] }>()
</script>

<template>
  <DashboardPanel id="goals" title="Savings goals" heading-id="goals-heading" class="goals-panel">
    <template #action
      ><button class="text-button" @click="emit('create')">+ New goal</button></template
    >
    <div class="goals-list">
      <article v-for="goal in goals" :key="goal.id" class="goal">
        <div class="goal-heading">
          <span class="goal-icon" :class="`text-${goal.tone}`"
            ><AppIcon name="goals" :size="22"
          /></span>
          <div>
            <h3>{{ goal.name }}</h3>
            <p>{{ goal.description }}</p>
          </div>
        </div>
        <div class="goal-amount">
          <span>{{ formatMoney(goal.saved, false) }} / {{ formatNumber(goal.target) }}</span
          ><span :class="`text-${goal.tone}`">{{ percentage(goal.saved, goal.target) }}%</span>
        </div>
        <div
          class="progress-track"
          role="progressbar"
          :aria-label="goal.name"
          :aria-valuenow="Math.min(100, percentage(goal.saved, goal.target))"
          :aria-valuetext="`${percentage(goal.saved, goal.target)}% saved`"
          :aria-valuemin="0"
          :aria-valuemax="100"
        >
          <span
            :class="`tone-${goal.tone}`"
            :style="{ width: progressWidth(goal.saved, goal.target) }"
          />
        </div>
      </article>
    </div>
  </DashboardPanel>
</template>
