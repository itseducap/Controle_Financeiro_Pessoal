<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{ mobileOpen: boolean }>()
const search = defineModel<string>('search', { required: true })
const emit = defineEmits<{ toggleMenu: []; notifications: [] }>()
const searchInput = ref<HTMLInputElement>()

function focusSearch(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
}
onMounted(() => window.addEventListener('keydown', focusSearch))
onUnmounted(() => window.removeEventListener('keydown', focusSearch))
</script>

<template>
  <header class="topbar">
    <button
      class="icon-button mobile-menu"
      aria-label="Toggle navigation"
      aria-controls="sidebar"
      :aria-expanded="mobileOpen"
      @click="emit('toggleMenu')"
    >
      <AppIcon :name="mobileOpen ? 'close' : 'menu'" />
    </button>
    <div class="breadcrumb">Workspace <span>/</span> Overview</div>
    <div class="topbar-actions">
      <label class="search-field"
        ><AppIcon name="search" :size="18" /><input
          ref="searchInput"
          v-model="search"
          type="search"
          placeholder="Search anything..."
          aria-label="Search transactions"
        /><kbd aria-hidden="true">Ctrl K</kbd></label
      >
      <button
        class="icon-button notification-button"
        aria-label="View notifications"
        @click="emit('notifications')"
      >
        <AppIcon name="bell" :size="21" /><span class="notification-dot" />
      </button>
      <span class="avatar topbar-avatar" aria-label="Eduardo Carvalho">EC</span>
    </div>
  </header>
</template>
