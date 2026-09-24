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
      h('div', { class: 'pane-override-body' }, `${props.name} 已挂载。`)
  },
})
</script>

<template>
  <div class="pane-override-demo">
    <s-alert type="flat">
      <template #title>已挂载 {{ mounted.length }} 个面板内容</template>
      {{ mounted.join('、') || '无' }}。草稿面板始终保留，其他面板离开时卸载。
    </s-alert>
    <s-tabs v-model="active" render-mode="active-only" :animated="false">
      <s-tab name="draft" label="草稿" render-mode="all">
        <mounted-pane name="草稿" />
      </s-tab>
      <s-tab name="preview" label="预览">
        <mounted-pane name="预览" />
      </s-tab>
      <s-tab name="history" label="历史">
        <mounted-pane name="历史" />
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
