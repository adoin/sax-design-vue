<script lang="ts" setup>
import { computed, ref, shallowRef } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'

interface WorkspaceTab {
  name: string
  order: number
}

const active = shallowRef('workspace-1')
const tabs = ref<WorkspaceTab[]>([
  { name: 'workspace-1', order: 1 },
  { name: 'workspace-2', order: 2 },
  { name: 'workspace-3', order: 3 },
])
const counter = shallowRef(3)
const { lang } = useLocale()

const copy = computed(() =>
  lang.value.startsWith('zh')
    ? { tab: '工作区', content: '正在编辑', empty: '至少保留一个标签页' }
    : { tab: 'Workspace', content: 'Editing', empty: 'Keep at least one tab' },
)

const label = (tab: WorkspaceTab) => `${copy.value.tab} ${tab.order}`

const addTab = () => {
  counter.value += 1
  const tab = { name: `workspace-${counter.value}`, order: counter.value }
  tabs.value.push(tab)
  active.value = tab.name
}

const removeTab = (name: string | number) => {
  if (tabs.value.length === 1) return
  const index = tabs.value.findIndex((tab) => tab.name === name)
  if (index < 0) return
  tabs.value.splice(index, 1)
  if (active.value === name) {
    active.value = tabs.value[Math.max(0, index - 1)].name
  }
}
</script>

<template>
  <s-tabs
    v-model="active"
    type="editable-card"
    overflow="collapse"
    @add="addTab"
    @remove="removeTab"
  >
    <s-tab
      v-for="tab in tabs"
      :key="tab.name"
      :name="tab.name"
      :label="label(tab)"
      :closable="tabs.length > 1"
    >
      <div class="tabs-editable-demo__panel">
        <s-icon name="cb:edit" />
        <span>{{ copy.content }} · {{ label(tab) }}</span>
      </div>
    </s-tab>
  </s-tabs>
</template>

<style scoped>
.tabs-editable-demo__panel {
  display: flex;
  min-height: 130px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: hsl(var(--sax-primary));
}
</style>
