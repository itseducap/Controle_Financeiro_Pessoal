<script setup lang="ts">
import type { IconName } from './AppIcon.vue'

defineProps<{ mobileOpen: boolean; activeSection: string }>()
const emit = defineEmits<{ navigate: [section: string]; close: []; settings: [] }>()
const navigation: { label: string; icon: IconName; section: string }[] = [
  { label: 'Overview', icon: 'overview', section: 'overview' },
  { label: 'Transactions', icon: 'transactions', section: 'transactions' },
  { label: 'Accounts', icon: 'accounts', section: 'accounts' },
  { label: 'Budgets', icon: 'budgets', section: 'budgets' },
  { label: 'Goals', icon: 'goals', section: 'goals' },
  { label: 'Reports', icon: 'reports', section: 'reports' },
]
</script>

<template>
  <aside
    id="sidebar"
    class="sidebar"
    :class="{ 'is-open': mobileOpen }"
    aria-label="Workspace navigation"
    @keydown.esc="emit('close')"
  >
    <a
      class="brand"
      href="#overview"
      aria-label="Orbit overview"
      @click.prevent="emit('navigate', 'overview')"
    >
      <svg width="32" height="32" viewBox="0 0 40 40" aria-hidden="true">
        <g transform="translate(20 20) rotate(-35)">
          <ellipse rx="16" ry="8" fill="none" stroke="currentColor" stroke-width="2" />
          <circle r="5" fill="currentColor" />
        </g>
      </svg>
      <span>orbit</span>
    </a>
    <div class="workspace-label">
      <strong>Personal workspace</strong><span>Your money, in focus.</span>
    </div>
    <nav aria-label="Main navigation">
      <button
        v-for="item in navigation"
        :key="item.section"
        class="nav-item"
        :class="{ active: activeSection === item.section }"
        :aria-current="activeSection === item.section ? 'location' : undefined"
        @click="emit('navigate', item.section)"
      >
        <AppIcon :name="item.icon" :size="22" /><span>{{ item.label }}</span>
      </button>
    </nav>
    <div class="sidebar-bottom">
      <div class="daily-card">
        <strong>A little clarity, daily.</strong>
        <p>Build a healthier<br />relationship with money.</p>
        <button class="text-button" @click="emit('navigate', 'reports')">
          Monthly report <AppIcon name="arrow" :size="18" />
        </button>
      </div>
      <button class="settings-link" @click="emit('settings')">Settings</button>
      <div class="profile">
        <span class="avatar">EC</span>
        <div><strong>Eduardo Carvalho</strong><span>Personal account</span></div>
      </div>
    </div>
  </aside>
</template>
