<script lang="ts" setup>
import { defineComponent, h, onBeforeUnmount, onMounted, shallowRef } from 'vue'

type RenderMode = 'all' | 'lazy' | 'active-only'

const active = shallowRef(1)
const mode = shallowRef<RenderMode>('all')
const mounted = shallowRef<number[]>([])
const paneNumbers = [1, 2, 3, 4]
const modeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Lazy', value: 'lazy' },
  { label: 'Active only', value: 'active-only' },
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
      h(
        'div',
        { class: 'render-mode-pane' },
        `Pane ${props.number} is mounted.`,
      )
  },
})
</script>

<template>
  <div class="render-mode-demo">
    <s-radio-group v-model="mode" type="button" :options="modeOptions" />
    <s-alert type="flat">
      <template #title>
        Mounted {{ mounted.length }} of {{ paneNumbers.length }} panes
      </template>
      Live pane content: {{ mounted.join(', ') || 'none' }}. Switch modes and
      tabs to compare their lifecycles.
    </s-alert>
    <s-tabs v-model="active" :render-mode="mode" :animated="false">
      <s-tab
        v-for="paneNumber in paneNumbers"
        :key="paneNumber"
        :name="paneNumber"
        :label="`Tab ${paneNumber}`"
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
