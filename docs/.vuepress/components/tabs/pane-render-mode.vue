<script lang="ts" setup>
import { defineComponent, h, onBeforeUnmount, onMounted, shallowRef } from 'vue'

const active = shallowRef('draft')
const mounted = shallowRef<string[]>([])

const MountedPane = defineComponent({
  name: 'MountedPane',
  props: { name: { type: String, required: true } },
  setup(props) {
    onMounted(() => {
      mounted.value = [...mounted.value, props.name]
    })
    onBeforeUnmount(() => {
      mounted.value = mounted.value.filter((name) => name !== props.name)
    })
    return () =>
      h('div', { class: 'pane-override-body' }, `${props.name} is mounted.`)
  },
})
</script>

<template>
  <div class="pane-override-demo">
    <s-alert type="flat">
      <template #title>Mounted pane content: {{ mounted.length }}</template>
      {{ mounted.join(', ') || 'none' }}. Draft stays mounted; other panes leave
      the DOM when inactive.
    </s-alert>
    <s-tabs v-model="active" render-mode="active-only" :animated="false">
      <s-tab name="draft" label="Draft" render-mode="all">
        <mounted-pane name="Draft" />
      </s-tab>
      <s-tab name="preview" label="Preview">
        <mounted-pane name="Preview" />
      </s-tab>
      <s-tab name="history" label="History">
        <mounted-pane name="History" />
      </s-tab>
    </s-tabs>
  </div>
</template>

<style scoped>
.pane-override-demo {
  display: grid;
  gap: 14px;
}

:deep(.pane-override-body) {
  min-height: 84px;
  display: grid;
  place-items: center;
  color: var(--sax-text-color-secondary, #667085);
}
</style>
