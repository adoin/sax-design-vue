<script setup lang="ts">
import { defineComponent, h, onBeforeUnmount } from 'vue'
import { SIcon, SNotification } from 'sax-design-vue'
import { zhCn } from 'sax-design-vue/locales'
import type { NotificationHandle } from 'sax-design-vue'

const examples = [
  {
    name: 'cb:time',
    label: '提醒',
    content: '有一条提醒等待查看。',
    color: 'primary',
  },
  {
    name: 'cb:help',
    label: '帮助',
    content: '前往帮助中心获取更多说明。',
    color: 'primary',
  },
  {
    name: 'cb:checkmark',
    label: '完成',
    content: '更改已保存。',
    color: 'success',
  },
  {
    name: 'cb:warning-alt',
    label: '警告',
    content: '继续之前请检查相关信息。',
    color: 'warn',
  },
  {
    name: 'cb:locked',
    label: '安全',
    content: '安全设置已更新。',
    color: 'primary',
  },
  {
    name: 'cb:document',
    label: '文档',
    content: '有一份新文档可供查看。',
    color: 'primary',
  },
  {
    name: 'cb:cloud-upload',
    label: '上传',
    content: '文件上传已完成。',
    color: 'success',
  },
  {
    name: 'cb:calendar',
    label: '日程',
    content: '日程已更新。',
    color: 'primary',
  },
].map((example) => ({
  ...example,
  icon: defineComponent({
    name: 'NotificationExampleIcon',
    setup: () => () => h(SIcon, { name: example.name, size: 24 }),
  }),
}))
const handles = new Set<NotificationHandle>()
const openNotification = (example: (typeof examples)[number]) => {
  const handle = SNotification({
    icon: example.icon,
    iconSize: '24px',
    color: example.color,
    title: example.label,
    content: example.content,
    onClose: () => handles.delete(handle),
  })
  handles.add(handle)
}
onBeforeUnmount(() => handles.forEach((handle) => handle.close()))
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notification-icon-grid">
      <s-button
        v-for="example in examples"
        :key="example.name"
        class="notification-icon-trigger"
        type="flat"
        block
        @click="openNotification(example)"
      >
        <template #prefix><s-icon :name="example.name" :size="20" /></template>
        {{ example.label }}
      </s-button>
    </div>
  </s-config-provider>
</template>

<style scoped>
.notification-icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
  gap: 12px;
  width: 100%;
  max-width: 640px;
  margin-inline: auto;
}
.notification-icon-trigger {
  min-height: 44px;
}
</style>
