<script setup lang="ts">
import { ref } from 'vue'
import { SSelect, SConfigProvider } from 'sax-design-vue'
const clicked = ref<string[]>([])
const ordered = ref<string[]>([])
const globalValue = ref<string[]>([])
const options = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C' },
]
</script>
<template>
  <div style="display: grid; gap: 20px; width: 100%">
    <p>Select C, then A, then B and compare the value arrays.</p>
    <div>
      <SSelect
        v-model="clicked"
        multiple
        :options="options"
        label="Default: selection order"
      />
      <p>{{ clicked }}</p>
    </div>
    <div>
      <SSelect
        v-model="ordered"
        multiple
        sort-by-option-order
        :options="options"
        label="Local: option order"
      />
      <p>{{ ordered }}</p>
    </div>
    <SConfigProvider :select="{ sortByOptionOrder: true }">
      <div>
        <SSelect
          v-model="globalValue"
          multiple
          :options="options"
          label="Inherited global setting"
        />
        <p>{{ globalValue }}</p>
      </div>
    </SConfigProvider>
  </div>
</template>
