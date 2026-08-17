<template>
  <div class="center content-inputs">
    <s-input v-model="value1" type="text" label="Text" />
    <s-input v-model="value2" type="password" label="Password" />
    <s-input
      v-model="value3"
      type="search"
      label="Search"
      controls
      @search-click="handleSearch"
    />
    <s-input v-model="value4" type="number" label="Number" />
    <s-input v-model="value5" type="url" label="Url" />

    <p class="search-feedback" role="status" aria-live="polite">
      {{ searchFeedback }}
    </p>
  </div>
</template>
<script lang="ts" setup>
import { shallowRef } from 'vue'

const value1 = shallowRef('')
const value2 = shallowRef('')
const value3 = shallowRef('')
const value4 = shallowRef('')
const value5 = shallowRef('')
const searchFeedback = shallowRef(
  'Press Enter or click the search icon to emit search-click.',
)

const handleSearch = (value: string) => {
  searchFeedback.value = `Captured search-click: ${value || '(empty)'}`
}
</script>

<style lang="scss" scoped>
.content-inputs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 28px 20px;

  .s-input {
    margin: 0;
  }
}

.search-feedback {
  flex: 0 0 100%;
  margin: -8px 0 0;
  color: rgba(var(--sax-text), 0.62);
  font-size: 0.78rem;
  text-align: center;
}
</style>
