<script setup lang="ts">
import { shallowRef } from 'vue'

const query = shallowRef('')
const lastSearch = shallowRef('')

const handleSearch = (value: string) => {
  lastSearch.value = value
}
</script>

<template>
  <div class="input-action-demo">
    <s-input
      v-model="query"
      type="search"
      controls
      placeholder="Search product"
      @search-click="handleSearch"
    />
    <span class="input-action-demo__status" aria-live="polite">
      Last search: {{ lastSearch || '—' }}
    </span>
  </div>
</template>

<style scoped>
.input-action-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.input-action-demo__status {
  color: rgba(var(--sax-text), 0.62);
  font-size: 0.78rem;
}
</style>
