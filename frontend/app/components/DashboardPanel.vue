<script setup lang="ts">
defineProps<{ title: string; headingId: string }>()
</script>

<template>
  <section class="panel" :aria-labelledby="headingId">
    <header class="panel-heading">
      <h2 :id="headingId">{{ title }}</h2>
      <slot name="action" />
    </header>
    <slot />
  </section>
</template>
