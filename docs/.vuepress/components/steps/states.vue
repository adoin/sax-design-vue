<script lang="ts" setup>
import { computed } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'
import type { StepItem } from '@vuesax-alpha/components/steps'

const { lang } = useLocale()

const copy = computed(() =>
  lang.value.startsWith('zh')
    ? {
        ariaLabel: '步骤状态',
        items: [
          { key: 'wait', title: '等待', status: 'wait' },
          { key: 'process', title: '进行', status: 'process' },
          { key: 'loading', title: '加载', status: 'loading' },
          { key: 'finish', title: '完成', status: 'finish' },
          { key: 'success', title: '成功', status: 'success' },
          { key: 'error', title: '错误', status: 'error' },
          { key: 'disabled', title: '禁用', status: 'disabled' },
        ] as StepItem[],
      }
    : {
        ariaLabel: 'Step statuses',
        items: [
          { key: 'wait', title: 'Wait', status: 'wait' },
          { key: 'process', title: 'Process', status: 'process' },
          { key: 'loading', title: 'Loading', status: 'loading' },
          { key: 'finish', title: 'Finish', status: 'finish' },
          { key: 'success', title: 'Success', status: 'success' },
          { key: 'error', title: 'Error', status: 'error' },
          { key: 'disabled', title: 'Disabled', status: 'disabled' },
        ] as StepItem[],
      },
)
</script>

<template>
  <s-steps
    :aria-label="copy.ariaLabel"
    :clickable="false"
    :items="copy.items"
    :show-step-index="false"
    size="small"
  />
</template>
