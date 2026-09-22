<script setup lang="ts">
import { computed, watch } from 'vue'
import { useChartTooltip } from '~/composables/useChartTooltip'
import { formatMoney } from '~/utils/format'
import type { CashFlowPoint, ChartPeriod, Money } from '~/types/finance'

const props = defineProps<{ points: CashFlowPoint[]; netCashFlow: Money }>()
const period = defineModel<ChartPeriod>('period', { required: true })
const periods: ChartPeriod[] = ['Month', 'Week', 'Year']
const { tooltipId, activeKey, anchor, triggerBindings, keepOpen, scheduleClose, close } =
  useChartTooltip()
const series = [
  { key: 'income', label: 'Income', tone: 'green', offset: -27 },
  { key: 'expenses', label: 'Expenses', tone: 'purple', offset: 3 },
] as const
// O teto se ajusta ao período, com três intervalos arredondados no eixo vertical.
const ceiling = computed(() => {
  const maximum = Math.max(...props.points.flatMap((point) => [point.income, point.expenses]), 1)
  const step = maximum > 1000000 ? 1000000 : 100000
  return Math.ceil(maximum / (step * 3)) * step * 3
})
const ticks = computed(() =>
  [1, 2 / 3, 1 / 3, 0].map((ratio) => ({
    y: 16 + (1 - ratio) * 136,
    value: ceiling.value * ratio,
  })),
)
const columnWidth = computed(() => 656 / props.points.length)
const barHeight = (amount: number) => (amount / ceiling.value) * 136
const bars = computed(() =>
  props.points.flatMap((point, index) =>
    series.map((item) => ({
      id: `${period.value}-${point.label}-${item.key}`,
      periodLabel: point.label,
      ...item,
      amount: point[item.key],
      height: barHeight(point[item.key]),
      x: 40 + columnWidth.value * (index + 0.5) + item.offset,
    })),
  ),
)
// Busca pelo identificador: o tooltip acompanha os valores reativos, sem copiar saldos.
const activeBar = computed(() => bars.value.find((bar) => bar.id === activeKey.value))
watch(period, close)
</script>

<template>
  <DashboardPanel
    id="reports"
    title="Cash flow"
    heading-id="cash-flow-heading"
    class="cash-flow-panel"
  >
    <template #action
      ><div class="period-switch" role="group" aria-label="Cash flow period">
        <button
          v-for="option in periods"
          :key="option"
          :aria-pressed="period === option"
          @click="period = option"
        >
          {{ option }}
        </button>
      </div></template
    >
    <div class="chart-meta">
      <p :class="netCashFlow >= 0 ? 'text-green' : 'text-peach'">
        Net cash flow
        <span>{{ netCashFlow >= 0 ? '+' : '−' }} {{ formatMoney(Math.abs(netCashFlow)) }}</span>
      </p>
      <div class="chart-legend">
        <span><i class="dot tone-green" />Income</span
        ><span><i class="dot expense-dot" />Expenses</span>
      </div>
    </div>
    <svg
      class="cash-flow-chart"
      viewBox="0 0 696 204"
      role="group"
      :aria-label="`${period} cash flow`"
    >
      <g v-for="tick in ticks" :key="tick.y">
        <text x="0" :y="tick.y + 4" class="chart-axis">
          {{ tick.value ? `${Math.round(tick.value / 100000)}k` : '0' }}
        </text>
        <line x1="40" x2="696" :y1="tick.y" :y2="tick.y" class="chart-gridline" />
      </g>
      <g
        v-for="bar in bars"
        :key="bar.id"
        v-bind="triggerBindings(bar.id)"
        role="button"
        tabindex="0"
        class="cash-flow-bar-target"
        :class="{ 'is-active': activeKey === bar.id }"
        :aria-label="`${bar.periodLabel} ${bar.label}: ${formatMoney(bar.amount)}`"
        :transform="`translate(${bar.x}, 152)`"
      >
        <!-- Contorno apenas de foco: valores zero continuam acessíveis sem criar hover invisível. -->
        <rect
          class="bar-focus-outline"
          x="0"
          :y="-Math.max(bar.height, 16)"
          width="24"
          :height="Math.max(bar.height, 16)"
          rx="5"
        />
        <rect
          class="cash-flow-bar"
          :class="bar.key === 'income' ? 'income-bar' : 'expense-bar'"
          x="0"
          :y="-bar.height"
          width="24"
          :height="bar.height"
          rx="5"
        />
      </g>
      <g v-for="(point, index) in points" :key="point.label" aria-hidden="true">
        <text
          :x="40 + columnWidth * (index + 0.5)"
          y="190"
          text-anchor="middle"
          class="chart-axis chart-month"
        >
          {{ point.label }}
        </text>
      </g>
    </svg>
    <ChartTooltip
      v-if="activeBar && anchor"
      :id="tooltipId"
      :anchor="anchor"
      :title="activeBar.periodLabel"
      :subtitle="`${period} · Cash flow`"
      :rows="[
        { label: activeBar.label, value: formatMoney(activeBar.amount), tone: activeBar.tone },
      ]"
      @keep-open="keepOpen"
      @leave="scheduleClose"
    />
  </DashboardPanel>
</template>
