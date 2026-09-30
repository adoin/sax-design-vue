<script setup lang="ts">
import { shallowRef } from 'vue'
import type { InputAutocompleteItem } from 'sax-design-vue'

const country = shallowRef('')
const city = shallowRef('')
const countries = [
  '中国',
  '中国香港',
  '中国澳门',
  '新加坡',
  '新西兰',
  '澳大利亚',
  '奥地利',
  '加拿大',
]
const cities: InputAutocompleteItem[] = [
  { value: '上海', label: '上海', description: '中国 · Asia/Shanghai' },
  { value: '深圳', label: '深圳', description: '中国 · Asia/Shanghai' },
  { value: '新加坡', label: '新加坡', description: '新加坡 · Asia/Singapore' },
  { value: '悉尼', label: '悉尼', description: '澳大利亚 · Australia/Sydney' },
  {
    value: '斯德哥尔摩',
    label: '斯德哥尔摩',
    description: '瑞典 · Europe/Stockholm',
    disabled: true,
  },
]
</script>

<template>
  <div class="autocomplete-demo">
    <div>
      <s-input
        v-model="country"
        :autocomplete="countries"
        label="国家或地区"
        placeholder="输入文字或选择建议"
        block
        allow-clear
      />
      <s-text color="text" size="small">当前值：{{ country || '—' }}</s-text>
    </div>
    <div>
      <s-input
        v-model="city"
        :autocomplete="cities"
        :autocomplete-min-length="1"
        label="城市"
        placeholder="试试输入“上”或“中国”"
        block
        allow-clear
      />
      <s-text color="text" size="small">当前值：{{ city || '—' }}</s-text>
    </div>
  </div>
</template>

<style scoped>
.autocomplete-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 24px;
  width: 100%;
}
.autocomplete-demo > div {
  display: grid;
  gap: 12px;
}
</style>
