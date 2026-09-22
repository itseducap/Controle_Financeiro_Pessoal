<script setup lang="ts">
import { formatMoney, formatNumber, percentage, progressWidth } from '~/utils/format'
import type { BudgetCategory, Money } from '~/types/finance'
import { computed } from 'vue'
import { useChartTooltip } from '~/composables/useChartTooltip'

const props = defineProps<{ categories: BudgetCategory[]; spent: Money; limit: Money }>()
const emit = defineEmits<{ manage: [] }>()
const { tooltipId, activeKey, anchor, triggerBindings, keepOpen, scheduleClose } = useChartTooltip()
const activeCategory = computed(() =>
  props.categories.find(
    (category) =>
      activeKey.value === `segment-${category.name}` ||
      activeKey.value === `progress-${category.name}`,
  ),
)
const tooltipRows = computed(() =>
  activeCategory.value
    ? [
        {
          label: 'Spent',
          value: formatMoney(activeCategory.value.spent),
          tone: activeCategory.value.tone,
        },
        { label: 'Budget limit', value: formatMoney(activeCategory.value.limit) },
        {
          label: 'Used',
          value: `${percentage(activeCategory.value.spent, activeCategory.value.limit)}%`,
        },
      ]
    : [],
)
</script>

<template>
  <DashboardPanel
    id="budgets"
    title="Monthly budget"
    heading-id="budget-heading"
    class="budget-panel"
  >
    <template #action><button class="text-button" @click="emit('manage')">Manage</button></template>
    <p class="budget-total">
      {{ formatMoney(spent, false) }} <span>/ {{ formatNumber(limit) }}</span>
    </p>
    <div
      class="budget-stack"
      role="group"
      :aria-label="`${percentage(spent, limit)}% of total budget used`"
    >
      <button
        v-for="category in categories"
        :key="category.name"
        v-bind="triggerBindings(`segment-${category.name}`)"
        type="button"
        class="budget-segment-target"
        :class="{ 'is-active': activeKey === `segment-${category.name}` }"
        :aria-label="`${category.name}: ${formatMoney(category.spent)} spent`"
        :style="{ width: `${(category.spent / Math.max(limit, spent, 1)) * 100}%` }"
      >
        <span class="budget-segment" :class="`tone-${category.tone}`" />
      </button>
    </div>
    <div class="budget-categories">
      <div v-for="category in categories" :key="category.name" class="budget-category">
        <div class="budget-category-label">
          <span><i class="dot" :class="`tone-${category.tone}`" />{{ category.name }}</span
          ><span
            >{{ formatMoney(category.spent, false) }} / {{ formatNumber(category.limit) }}</span
          >
        </div>
        <div
          v-bind="triggerBindings(`progress-${category.name}`)"
          class="budget-progress-target"
          :class="{ 'is-active': activeKey === `progress-${category.name}` }"
          tabindex="0"
          role="progressbar"
          :aria-label="category.name"
          :aria-valuenow="Math.min(100, percentage(category.spent, category.limit))"
          :aria-valuetext="`${percentage(category.spent, category.limit)}% of budget used`"
          :aria-valuemin="0"
          :aria-valuemax="100"
        >
          <span class="progress-track"
            ><span
              :class="`tone-${category.tone}`"
              :style="{ width: progressWidth(category.spent, category.limit) }"
          /></span>
        </div>
      </div>
    </div>
    <ChartTooltip
      v-if="activeCategory && anchor"
      :id="tooltipId"
      :anchor="anchor"
      :title="activeCategory.name"
      subtitle="Monthly budget"
      :rows="tooltipRows"
      @keep-open="keepOpen"
      @leave="scheduleClose"
    />
  </DashboardPanel>
</template>
