<script lang="ts" setup>
import { defineComponent, h, onBeforeUnmount, onMounted, shallowRef } from 'vue'

type RenderMode = 'all' | 'lazy' | 'active-only'

const active = shallowRef(1)
const mode = shallowRef<RenderMode>('all')
const mounted = shallowRef<number[]>([])
const paneNumbers = [1, 2, 3, 4]
const modeOptions = [
  { label: '全部挂载', value: 'all' },
  { label: '首次挂载', value: 'lazy' },
  { label: '仅当前', value: 'active-only' },
]

const MountedPane = defineComponent({
  name: 'MountedPane',
  props: { number: { type: Number, required: true } },
  setup(props) {
    onMounted(() => {
      mounted.value = [...mounted.value, props.number].sort((a, b) => a - b)
    })
    onBeforeUnmount(() => {
      mounted.value = mounted.value.filter((number) => number !== props.number)
    })
    return () =>
      h('div', { class: 'render-mode-pane' }, `面板 ${props.number} 已挂载。`)
  },
})
</script>

<template>
  <div class="render-mode-demo">
    <s-radio-group v-model="mode" type="button" :options="modeOptions" />
    <s-alert type="flat">
      <template #title>
        已挂载 {{ mounted.length }} / {{ paneNumbers.length }} 个面板
      </template>
      当前内容：{{ mounted.join('、') || '无' }}。切换策略和标签可比较挂载周期。
    </s-alert>
    <s-tabs v-model="active" :render-mode="mode" :animated="false">
      <s-tab
        v-for="paneNumber in paneNumbers"
        :key="paneNumber"
        :name="paneNumber"
        :label="`标签 ${paneNumber}`"
      >
        <mounted-pane :number="paneNumber" />
      </s-tab>
    </s-tabs>
  </div>
</template>

<style scoped>
.render-mode-demo {
  display: grid;
  gap: 14px;
}

:deep(.render-mode-pane) {
  min-height: 84px;
  display: grid;
  place-items: center;
  color: var(--sax-text-color-secondary, #667085);
}
</style>
