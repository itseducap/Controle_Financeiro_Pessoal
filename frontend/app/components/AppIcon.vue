<script setup lang="ts">
export type IconName =
  | 'overview'
  | 'transactions'
  | 'accounts'
  | 'budgets'
  | 'goals'
  | 'reports'
  | 'arrow'
  | 'search'
  | 'bell'
  | 'plus'
  | 'close'
  | 'menu'
  | 'settings'
  | 'check'

defineProps<{ name: IconName; size?: number }>()

// Ícones vetoriais locais: nenhuma fonte de ícones ou requisição externa é necessária.
const paths: Record<IconName, string> = {
  overview: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  transactions: 'M3 7h16m-4-4 4 4-4 4 M21 17H5m4-4-4 4 4 4',
  accounts: 'M3 5h18v14H3z M3 10h18 M15 15h3',
  budgets: 'M4 3h16v18H4z M8 7h8 M8 12h8 M8 17h5',
  goals: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0 M12 11v2',
  reports: 'M3 21h18 M5 16V10 M12 16V3 M19 16V7',
  arrow: 'M5 19 19 5 M7 5h12v12',
  search: 'm16 16 5 5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  bell: 'M18 8a6 6 0 0 0-12 0v7l-3 4h18l-3-4z M10 22h4',
  plus: 'M12 5v14 M5 12h14',
  close: 'm6 6 12 12 M6 18 18 6',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  settings:
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2',
  check: 'm5 12 4 4L19 6',
}
</script>

<template>
  <svg
    :width="size ?? 20"
    :height="size ?? 20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name]" />
  </svg>
</template>
