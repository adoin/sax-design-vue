<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
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
const showAllTasks = shallowRef(false)
const visibleTasks = computed(() =>
  showAllTasks.value ? props.tasks : props.tasks.slice(0, 3),
)
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
  <section
    :class="[ns.b(), 's-agent-surface', `is-${shape}`]"
    @keydown.enter.ctrl.prevent="
      !disabled && status === 'pending' && emit('approve')
    "
    @keydown.enter.meta.prevent="
      !disabled && status === 'pending' && emit('approve')
    "
  >
    <div class="s-agent-heading">
      <span class="s-agent-card-heading-icon"
        ><SIcon name="cb:task" aria-hidden="true"
      /></span>
      <h3 class="s-agent-grow">{{ title }}</h3>
      <SButton
        icon
        size="small"
        type="flat"
        :shape="shape"
        :aria-label="t('vs.agent.download')"
        @click="downloadPlan"
        ><SIcon name="cb:download" /><span class="s-agent-sr-only">{{
          t('vs.agent.download')
        }}</span></SButton
      >
    </div>
    <p v-if="description" class="s-agent-muted">{{ description }}</p>
    <div v-if="tasks.length" class="s-agent-plan-tasks">
      <div class="s-agent-plan-task-heading">
        <SIcon name="cb:task-complete" aria-hidden="true" /><span
          class="s-agent-grow"
          >{{ t('vs.agent.tasks') }}</span
        ><span class="s-agent-muted">{{ tasks.length }}</span>
      </div>
      <STaskList :tasks="visibleTasks" :shape="shape" /><button
        v-if="tasks.length > 3"
        type="button"
        class="s-agent-control s-agent-text-button"
        :aria-expanded="showAllTasks"
        @click="showAllTasks = !showAllTasks"
      >
        {{
          showAllTasks
            ? t('vs.agent.showLess')
            : t('vs.agent.moreTasks', { count: tasks.length - 3 })
        }}
      </button>
    </div>
    <Transition name="s-agent-reveal"
      ><div v-if="expanded" class="s-agent-stream">
        <slot>{{ content }}</slot>
      </div></Transition
    >
    <div class="s-agent-actions">
      <button
        type="button"
        class="s-agent-control s-agent-text-button"
        :aria-expanded="expanded"
        @click="emit('update:expanded', !expanded)"
      >
        {{ t('vs.agent.viewPlan') }}
        <SIcon
          :name="expanded ? 'cb:chevron-up' : 'cb:chevron-down'"
          aria-hidden="true"
        />
      </button>
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
