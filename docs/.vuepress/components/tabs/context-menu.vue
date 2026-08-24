<script lang="ts" setup>
import { computed, ref, shallowRef } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'
import type { ContextMenuItem } from '@vuesax-alpha/components/context-menu'

interface ProjectTab {
  name: string
  label: string
}

const active = shallowRef('design')
const message = shallowRef('')
const tabs = ref<ProjectTab[]>([
  { name: 'design', label: 'Design' },
  { name: 'development', label: 'Development' },
  { name: 'release', label: 'Release' },
])
const { lang } = useLocale()

const copy = computed(() =>
  lang.value.startsWith('zh')
    ? {
        labels: { design: '设计', development: '开发', release: '发布' },
        refresh: '刷新',
        close: '关闭',
        closeOthers: '关闭其他标签',
        refreshed: '已刷新',
        hint: '右键点击任意标签',
      }
    : {
        labels: {
          design: 'Design',
          development: 'Development',
          release: 'Release',
        },
        refresh: 'Refresh',
        close: 'Close',
        closeOthers: 'Close other tabs',
        refreshed: 'Refreshed',
        hint: 'Right-click any tab',
      },
)

const tabLabel = (tab: ProjectTab) =>
  copy.value.labels[tab.name as keyof typeof copy.value.labels]

const menuItems = (): ContextMenuItem[] => [
  { label: copy.value.refresh, value: 'refresh', icon: 'cb:renew' },
  {
    label: copy.value.close,
    value: 'close',
    icon: 'cb:close',
    disabled: tabs.value.length === 1,
  },
  {
    label: copy.value.closeOthers,
    value: 'others',
    icon: 'cb:subtract-alt',
    divided: true,
    disabled: tabs.value.length === 1,
  },
]

const closeTab = (tab: ProjectTab) => {
  const index = tabs.value.findIndex((item) => item.name === tab.name)
  tabs.value.splice(index, 1)
  if (active.value === tab.name) {
    active.value = tabs.value[Math.max(0, index - 1)].name
  }
}

const handleMenu = (tab: ProjectTab, action?: string | number) => {
  if (action === 'refresh')
    message.value = `${copy.value.refreshed} · ${tabLabel(tab)}`
  if (action === 'close') closeTab(tab)
  if (action === 'others') {
    tabs.value = [tab]
    active.value = tab.name
  }
}
</script>

<template>
  <div class="tabs-context-demo">
    <s-tabs v-model="active" type="card">
      <s-tab
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tabLabel(tab)"
      >
        <template #label>
          <s-context-menu
            :items="menuItems()"
            @select="handleMenu(tab, $event.value)"
          >
            <span class="tabs-context-demo__label">{{ tabLabel(tab) }}</span>
          </s-context-menu>
        </template>
        <div class="tabs-context-demo__panel">
          <strong>{{ tabLabel(tab) }}</strong>
          <span>{{ message || copy.hint }}</span>
        </div>
      </s-tab>
    </s-tabs>
  </div>
</template>

<style scoped>
.tabs-context-demo__label {
  display: inline-flex;
  align-items: center;
}

.tabs-context-demo__panel {
  display: grid;
  min-height: 110px;
  place-content: center;
  gap: 7px;
  text-align: center;
}

.tabs-context-demo__panel span {
  color: hsl(var(--sax-text) / 0.58);
}
</style>
