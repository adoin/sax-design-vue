<script setup lang="ts">
import { shallowRef } from 'vue'

const textValue = shallowRef('')
const encodedValue = shallowRef('')

const countUtf8Bytes = ({ value }: { value: string }) =>
  new TextEncoder().encode(value).length
</script>

<template>
  <div class="input-count-demo">
    <s-input
      v-model="textValue"
      placeholder="Up to 12 characters"
      :max-length="12"
      show-word-count
    />
    <s-input
      v-model="encodedValue"
      placeholder="Up to 12 UTF-8 bytes"
      :max-length="12"
      :count-method="countUtf8Bytes"
      show-word-count
    />
  </div>
</template>

<style scoped>
.input-count-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
