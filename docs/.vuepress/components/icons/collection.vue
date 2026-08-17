<script setup lang="ts">
const examples = [
  'cb:home',
  'cb:search',
  'cb:settings',
  'cb:calendar',
  'cb:notification',
  'cb:copy',
  'bx:book',
  'bx:home-alt',
  'bxs:heart',
  'bxs:wallet',
  'bxl:github',
  'bxl:twitter',
]
</script>

<template>
  <div class="icon-grid">
    <div v-for="name in examples" :key="name" class="icon-grid__item">
      <s-icon :name="name" size="28" />
      <code>{{ name }}</code>
    </div>
  </div>
</template>

<style scoped lang="scss">
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
  width: 100%;

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 14px 16px;
    border-radius: var(--sax-radius-lg);
    background: rgba(var(--sax-background), 0.72);
    box-shadow: var(--sax-input-shadow, 0 8px 24px rgba(37, 99, 255, 0.08));
  }

  code {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
