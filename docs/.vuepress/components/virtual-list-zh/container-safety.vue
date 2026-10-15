<script setup lang="ts">
import { computed, ref } from 'vue'
import { SButton, STag, SVirtualList } from 'sax-design-vue'
import type { CSSProperties } from 'vue'

type Mode = 'auto' | 'small' | 'large' | 'hidden'
const mode = ref<Mode>('auto')
const range = ref({ start: 0, end: 0 })
const choices = [
  { value: 'auto' as const, label: '父容器未限高' },
  { value: 'small' as const, label: '父容器 220px' },
  { value: 'large' as const, label: '父容器 420px' },
  { value: 'hidden' as const, label: '暂时隐藏（0px）' },
]
const parentStyle = computed<CSSProperties>(() => ({
  height: { auto: 'auto', small: '220px', large: '420px', hidden: '0px' }[
    mode.value
  ],
  overflow: 'hidden',
  minHeight: '0',
}))
const itemAt = (index: number) => index + 1
const itemKeyAt = (index: number) => index
</script>

<template>
  <div style="width: 100%; min-width: 0">
    <div
      style="
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        margin-bottom: 16px;
      "
    >
      <SButton
        v-for="choice in choices"
        :key="choice.value"
        :flat="mode !== choice.value"
        :debounce="false"
        @click="mode = choice.value"
        >{{ choice.label }}</SButton
      >
      <STag>实际渲染 {{ range.start + 1 }}–{{ range.end + 1 }} / 100,000</STag>
    </div>
    <div :style="parentStyle">
      <SVirtualList
        style="height: 100%; min-height: 0"
        height="100%"
        :count="100_000"
        :item-at="itemAt"
        :item-key-at="itemKeyAt"
        :estimate-size="40"
        :dynamic="false"
        @range-change="range = $event"
      >
        <template #default="{ item }"
          ><div
            style="
              height: 40px;
              padding: 0 12px;
              display: flex;
              align-items: center;
            "
          >
            记录 {{ item }}
          </div></template
        >
      </SVirtualList>
    </div>
  </div>
</template>
