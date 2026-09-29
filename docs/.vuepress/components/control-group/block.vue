<script setup lang="ts">
import { shallowRef } from 'vue'

const country = shallowRef('+86')
const phone = shallowRef('')
const selectOptions1 = [
  { label: 'China +86', value: '+86' },
  { label: 'US +1', value: '+1' },
]
</script>

<template>
  <div class="control-group-block-demo">
    <span id="phone-number-label" class="control-group-block-demo__label">
      Phone number
    </span>
    <s-control-group block aria-labelledby="phone-number-label">
      <s-select v-model="country" :options="selectOptions1" />
      <s-input v-model="phone" input-mode="tel" placeholder="Phone number" />
    </s-control-group>
  </div>
</template>

<style scoped>
.control-group-block-demo {
  display: flex;
  width: min(100%, 480px);
  flex-direction: column;
  gap: 8px;
}

.control-group-block-demo__label {
  color: var(--sax-text-color);
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
