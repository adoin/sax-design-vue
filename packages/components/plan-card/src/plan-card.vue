<script setup lang="ts">
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'

import { STaskList } from '@vuesax-alpha/components/task-list'
import { downloadAgentText } from '../../ai-editor/src/agent-shared/utils'
import { planCardEmits, planCardProps } from './plan-card'
defineOptions({ name: 'SPlanCard' })
const props = defineProps(planCardProps)
const emit = defineEmits(planCardEmits)
const ns = useNamespace('plan-card')
const shape = useShape()
const { t } = useLocale()
const downloadPlan = () => {
  downloadAgentText(
    [
      props.title,
      props.description,
      props.content,
      ...props.tasks.map((task) => `- ${task.title}`),
    ]
      .filter(Boolean)
      .join('\n\n'),
    'plan.txt',
  )
  emit('download')
}
</script>

<template>
  <section :class="[ns.b(), 's-agent-surface', `is-${shape}`]">
    <div class="s-agent-heading">
      <h3>{{ title }}</h3>
      <SButton type="flat" :shape="shape" @click="downloadPlan">{{
        t('vs.agent.download')
      }}</SButton>
    </div>
    <p v-if="description" class="s-agent-muted">{{ description }}</p>
    <STaskList v-if="tasks.length" :tasks="tasks" :shape="shape" /><button
      type="button"
      class="s-agent-control s-agent-text-button"
      :aria-expanded="expanded"
      @click="emit('update:expanded', !expanded)"
    >
      {{ t('vs.agent.viewPlan') }} {{ expanded ? '−' : '+' }}</button
    ><Transition name="s-agent-reveal"
      ><div v-if="expanded" class="s-agent-stream">
        <slot>{{ content }}</slot>
      </div></Transition
    >
    <div class="s-agent-actions">
      <template v-if="status === 'pending'"
        ><SButton
          :shape="shape"
          :disabled="disabled"
          @click="emit('approve')"
          >{{ t('vs.agent.approve') }}</SButton
        ><SButton
          type="flat"
          :shape="shape"
          :disabled="disabled"
          @click="emit('reject')"
          >{{ t('vs.agent.reject') }}</SButton
        ></template
      ><span v-else role="status">{{ t(`vs.agent.${status}`) }}</span
      ><slot name="actions" :status="status" />
    </div>
  </section>
</template>
