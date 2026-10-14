<script setup lang="ts">
import { ref } from 'vue'
const integer = ref(4)
const decimal = ref(1.25)
const cleared = ref(5)
</script>
<template>
  <div class="number-examples">
    <s-input-number
      v-model="integer"
      :min="0"
      :max="10"
      :step="2"
      step-strictly
      label="Integer steps"
    />
    <s-input-number
      v-model="decimal"
      :min="0"
      :max="20"
      :step="0.25"
      :precision="2"
      label="Decimal steps"
    />
    <s-input-number
      v-model="cleared"
      :value-on-clear="0"
      label="Clear to zero"
    />
  </div>
</template>
<style scoped>
.number-examples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 32px;
  padding: 20px 0;
}
</style>
