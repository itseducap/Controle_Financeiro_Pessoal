<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { Tone } from '~/types/finance'

const props = defineProps<{
  id: string
  anchor: Element
  title: string
  subtitle?: string
  rows: { label: string; value: string; tone?: Tone }[]
}>()
const emit = defineEmits<{ keepOpen: []; leave: [] }>()
const tooltip = ref<HTMLDivElement>()
const position = ref({ left: '0px', top: '0px' })
const positioned = ref(false)

async function updatePosition() {
  await nextTick()
  if (!tooltip.value || !props.anchor.isConnected) return
  const target = props.anchor.getBoundingClientRect()
  const bounds = tooltip.value.getBoundingClientRect()
  const margin = 12
  const gap = 14
  const above = target.top - bounds.height - gap
  const top = above >= margin ? above : target.bottom + gap

  // Coordenadas de viewport + Teleport evitam cortes por overflow dos painéis.
  position.value = {
    left: `${Math.max(margin, Math.min(target.left + target.width / 2 - bounds.width / 2, window.innerWidth - bounds.width - margin))}px`,
    top: `${Math.max(margin, Math.min(top, window.innerHeight - bounds.height - margin))}px`,
  }
  positioned.value = true
}

onMounted(updatePosition)
watch(() => [props.anchor, props.title, props.rows], updatePosition, { deep: true, flush: 'post' })
</script>

<template>
  <Teleport to="body">
    <div
      :id="id"
      ref="tooltip"
      role="tooltip"
      class="chart-tooltip"
      :style="{ ...position, visibility: positioned ? 'visible' : 'hidden' }"
      @pointerenter="emit('keepOpen')"
      @pointerleave="emit('leave')"
    >
      <p v-if="subtitle" class="chart-tooltip-subtitle">{{ subtitle }}</p>
      <p class="chart-tooltip-title">{{ title }}</p>
      <dl>
        <div v-for="row in rows" :key="row.label">
          <dt>{{ row.label }}</dt>
          <dd :class="row.tone ? `text-${row.tone}` : undefined">{{ row.value }}</dd>
        </div>
      </dl>
    </div>
  </Teleport>
</template>
