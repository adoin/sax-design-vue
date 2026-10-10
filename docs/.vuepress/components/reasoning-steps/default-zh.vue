<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { AgentSource, AgentTask } from 'sax-design-vue'
const expanded = ref(false)
const steps = ref<AgentTask[]>([])
const sources = ref<AgentSource[]>([])
const reasoning = ref<string[]>([])
const paragraphs = [
  '阅读事故复盘，找出讨论回滚的段落。',
  '失败的构建已影响用户，团队随后执行了回滚。',
  '核对现有发布策略，寻找可沿用的阈值。',
  '流量超过 25% 时，需要第二位审核人。',
  '先在 5% 流量下观察十分钟，再扩大发布范围。',
  '对照通话中的决策，检查拟定的规则。',
]
const timers: ReturnType<typeof setTimeout>[] = []
function clearTimers() {
  timers.splice(0).forEach(clearTimeout)
}
function replay() {
  clearTimers()
  expanded.value = false
  reasoning.value = []
  sources.value = []
  steps.value = [
    { id: 'review', title: '审阅事故通话', status: 'running' },
    { id: 'draft', title: '拟定发布策略', status: 'pending' },
  ]
  timers.push(
    setTimeout(() => {
      sources.value = [
        {
          id: 'call',
          title: '3 月 4 日事故复盘',
          href: 'https://example.com/incident',
          icon: 'cb:group',
        },
        {
          id: 'policy',
          title: 'ENG-2841 发布策略',
          href: 'https://example.com/policy',
          icon: 'cb:document',
        },
      ]
    }, 600),
    setTimeout(() => {
      steps.value = steps.value.map((step, index) => ({
        ...step,
        status: index === 0 ? 'complete' : 'running',
      }))
    }, 1750),
  )
  paragraphs.forEach((paragraph, index) => {
    timers.push(
      setTimeout(
        () => {
          reasoning.value = [...reasoning.value, paragraph]
        },
        3500 + index * 650,
      ),
    )
  })
  timers.push(
    setTimeout(() => {
      steps.value = steps.value.map((step) => ({ ...step, status: 'complete' }))
    }, 7400),
  )
}
onMounted(replay)
onBeforeUnmount(clearTimers)
</script>

<template>
  <div class="agent-demo">
    <s-reasoning-steps
      v-model:expanded="expanded"
      :steps="steps"
      :sources="sources"
      :reasoning="reasoning"
    />
    <s-button size="small" @click="replay">重新播放</s-button>
  </div>
</template>

<style scoped>
.agent-demo {
  display: grid;
  gap: 24px;
  width: 100%;
  min-width: 0;
}
.agent-demo > .s-button {
  justify-self: start;
}
</style>
