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
    <p>依次选择 C、A、B，比较下面的值数组。</p>
    <div>
      <SSelect
        v-model="clicked"
        multiple
        :options="options"
        label="默认：选择顺序"
      />
      <p>{{ clicked }}</p>
    </div>
    <div>
      <SSelect
        v-model="ordered"
        multiple
        sort-by-option-order
        :options="options"
        label="局部开启：选项顺序"
      />
      <p>{{ ordered }}</p>
    </div>
    <SConfigProvider :select="{ sortByOptionOrder: true }">
      <div>
        <SSelect
          v-model="globalValue"
          multiple
          :options="options"
          label="继承全局配置"
        />
        <p>{{ globalValue }}</p>
      </div>
    </SConfigProvider>
  </div>
</template>
