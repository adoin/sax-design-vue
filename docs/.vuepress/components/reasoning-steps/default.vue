<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { AgentSource, AgentTask } from 'sax-design-vue'
const expanded = ref(false)
const steps = ref<AgentTask[]>([])
const sources = ref<AgentSource[]>([])
const reasoning = ref<string[]>([])
const paragraphs = [
  'Reading the incident review and identifying where the rollback was discussed.',
  'The failed build reached users before the team reverted it.',
  'Checking the existing policy for a threshold we can reuse.',
  'A second reviewer is required above 25% of traffic.',
  'Drafting a ten-minute bake at 5% before a wider rollout.',
  'Checking the proposed rule against the decisions from the call.',
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
    { id: 'review', title: 'Reviewing the incident call', status: 'running' },
    { id: 'draft', title: 'Drafting the rollout policy', status: 'pending' },
  ]
  timers.push(
    setTimeout(() => {
      sources.value = [
        {
          id: 'call',
          title: 'Mar 4 incident review',
          href: 'https://example.com/incident',
          icon: 'cb:group',
        },
        {
          id: 'policy',
          title: 'ENG-2841 rollout policy',
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
    <s-button size="small" @click="replay">Replay process</s-button>
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
