<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'
import type { StepItem } from '@vuesax-alpha/components/steps'

const active = shallowRef(2)
const { lang } = useLocale()

const copy = computed(() =>
  lang.value.startsWith('zh')
    ? {
        ariaLabel: '部署进度',
        waiting: '等待上一步完成',
        continue: '继续',
        items: [
          {
            key: 'deployment',
            title: '创建部署',
            meta: '已完成 · 2 分 14 秒前',
          },
          {
            key: 'configure',
            title: '配置环境',
            meta: '已完成 · 1 分 32 秒前',
          },
          {
            key: 'validate',
            title: '验证配置',
            description: '正在运行检查',
            meta: '已用时 1 分 08 秒',
          },
          { key: 'deploy', title: '执行部署' },
          { key: 'complete', title: '部署完成', status: 'disabled' },
        ] as StepItem[],
      }
    : {
        ariaLabel: 'Deployment progress',
        waiting: 'Waiting for the previous step',
        continue: 'Continue',
        items: [
          {
            key: 'deployment',
            title: 'Deployment',
            meta: 'Completed · 2m 14s ago',
          },
          {
            key: 'configure',
            title: 'Configure',
            meta: 'Completed · 1m 32s ago',
          },
          {
            key: 'validate',
            title: 'Validate',
            description: 'Running checks',
            meta: '1m 08s elapsed',
          },
          { key: 'deploy', title: 'Deploy' },
          { key: 'complete', title: 'Complete', status: 'disabled' },
        ] as StepItem[],
      },
)

const items = computed(() => copy.value.items)

const continueTimeline = () => {
  active.value = Math.min(items.value.length - 2, active.value + 1)
}
</script>

<template>
  <s-steps
    v-model:active="active"
    :aria-label="copy.ariaLabel"
    :items="items"
    process-status="loading"
    variant="timeline"
  >
    <template #content="{ item }">
      <span class="steps-timeline-demo__detail">
        <s-icon name="cb:time" />
        {{ item.meta || copy.waiting }}
      </span>
    </template>
    <template #actions>
      <s-button @click="continueTimeline">{{ copy.continue }}</s-button>
    </template>
  </s-steps>
</template>

<style scoped>
.steps-timeline-demo__detail {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
</style>
