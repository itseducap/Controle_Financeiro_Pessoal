<script setup lang="ts">
import { onMounted, onUnmounted, ref, useId } from 'vue'

defineProps<{ title: string }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement>()
const titleId = useId()
let previouslyFocused: HTMLElement | null = null

// O elemento nativo gerencia Escape e mantém o foco dentro da janela modal.
onMounted(() => {
  previouslyFocused = document.activeElement as HTMLElement | null
  dialog.value?.showModal()
  document.body.classList.add('modal-open')
})
onUnmounted(() => {
  dialog.value?.close()
  document.body.classList.remove('modal-open')
  previouslyFocused?.focus()
})

function closeOnBackdrop(event: MouseEvent) {
  if (event.target !== dialog.value) return
  const bounds = dialog.value.getBoundingClientRect()
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    emit('close')
}
</script>

<template>
  <dialog
    ref="dialog"
    class="modal"
    :aria-labelledby="titleId"
    @cancel.prevent="emit('close')"
    @click="closeOnBackdrop"
  >
    <header class="modal-heading">
      <h2 :id="titleId">{{ title }}</h2>
      <button class="icon-button" aria-label="Close dialog" @click="emit('close')">
        <AppIcon name="close" />
      </button>
    </header>
    <slot />
  </dialog>
</template>
