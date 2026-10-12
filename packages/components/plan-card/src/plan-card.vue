<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SCountdown } from '@vuesax-alpha/components/countdown'
import { SButton } from '@vuesax-alpha/components/button'

import { STaskList } from '@vuesax-alpha/components/task-list'
import { downloadAgentText } from '../../agent-editor/src/agent-shared/utils'
import { planCardEmits, planCardProps } from './plan-card'
import type { CountdownTime } from '@vuesax-alpha/components/countdown'
defineOptions({ name: 'SPlanCard' })
const props = defineProps(planCardProps)
const emit = defineEmits(planCardEmits)
const ns = useNamespace('plan-card')
const { t } = useLocale()
const visibleTasks = computed(() =>
  props.expanded ? props.tasks : props.tasks.slice(0, 3),
)
const toggleExpanded = () => {
  if (!props.disabled) emit('update:expanded', !props.expanded)
}
const settled = shallowRef(false)
const cancelled = shallowRef(false)
const deadline = shallowRef(0)
const remaining = shallowRef(0)
const duration = computed(() =>
  Number.isFinite(props.autoApprove)
    ? Math.max(0, props.autoApprove * 1000)
    : 0,
)
const countdownActive = computed(
  () =>
    duration.value > 0 &&
    props.status === 'pending' &&
    !props.disabled &&
    !settled.value &&
    !cancelled.value,
)
watch(
  () => [
    props.autoApprove,
    props.status,
    props.disabled,
    props.title,
    props.description,
    props.content,
    props.tasks,
  ],
  () => {
    settled.value = false
    cancelled.value = false
    remaining.value = duration.value
    deadline.value = Date.now() + duration.value
  },
  { immediate: true, deep: true },
)
const decide = (action: 'approve' | 'reject', automatic = false) => {
  if (
    props.disabled ||
    props.status !== 'pending' ||
    settled.value ||
    (automatic && !countdownActive.value)
  )
    return
  settled.value = true
  if (automatic) emit('auto-approve')
  if (action === 'approve') emit('approve')
  else emit('reject')
}
const cancelAutoApprove = () => {
  if (!countdownActive.value) return
  cancelled.value = true
  emit('cancel-auto-approve')
}
const countdownLabel = (time: Readonly<CountdownTime>) =>
  t('vs.agent.autoApproveIn', { seconds: time.totalSeconds })
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
    :class="[
      ns.b(),
      's-agent-surface',
      {
        'is-approved': status === 'approved',
        'is-rejected': status === 'rejected',
      },
    ]"
    @keydown.enter.ctrl.prevent="decide('approve')"
    @keydown.enter.meta.prevent="decide('approve')"
  >
    <div class="s-agent-heading">
      <span class="s-agent-card-heading-icon s-plan-card__heading-icon">
        <Transition name="s-plan-card-check" mode="out-in">
          <svg
            v-if="status === 'approved'"
            key="approved"
            class="s-plan-card__check"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="m5 12 4.5 4.5L19 7" pathLength="1" />
          </svg>
          <SIcon v-else key="plan" name="cb:task" aria-hidden="true" />
        </Transition>
      </span>
      <h3 class="s-agent-grow">{{ title }}</h3>
      <SButton
        icon
        size="small"
        type="flat"
        shape="rounded"
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
      <STaskList :tasks="visibleTasks" /><button
        v-if="tasks.length > 3"
        type="button"
        class="s-agent-control s-agent-text-button"
        :disabled="disabled"
        :aria-expanded="expanded"
        @click="toggleExpanded"
      >
        <SIcon
          v-if="!expanded"
          name="cb:overflow-menu-horizontal"
          :size="16"
          aria-hidden="true"
        />
        {{
          expanded
            ? t('vs.agent.showLess')
            : t('vs.agent.moreTasks', { count: tasks.length - 3 })
        }}
      </button>
    </div>
    <div v-if="$slots.default" class="s-agent-stream"><slot /></div>
    <div class="s-agent-actions s-plan-card__footer">
      <button
        v-if="countdownActive"
        type="button"
        class="s-agent-control s-plan-card__auto-approve"
        :title="t('vs.agent.cancelAutoApprove')"
        :aria-label="t('vs.agent.cancelAutoApprove')"
        @click="cancelAutoApprove"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="8" class="s-plan-card__timer-track" />
          <circle
            cx="10"
            cy="10"
            r="8"
            class="s-plan-card__timer-progress"
            pathLength="100"
            :stroke-dasharray="`${duration > 0 ? (remaining / duration) * 100 : 0} 100`"
          />
        </svg>
        <SCountdown
          :value="deadline"
          :formatter="countdownLabel"
          @change="remaining = $event"
          @finish="decide('approve', true)"
        />
      </button>
      <span
        v-else-if="cancelled && status === 'pending'"
        class="s-agent-muted s-plan-card__auto-cancelled"
        role="status"
        >{{ t('vs.agent.autoApproveCancelled') }}</span
      >
      <span class="s-agent-grow" />
      <button
        type="button"
        class="s-agent-control s-agent-text-button"
        :disabled="disabled"
        :aria-expanded="expanded"
        @click="toggleExpanded"
      >
        {{ t(expanded ? 'vs.agent.hidePlan' : 'vs.agent.viewPlan') }}
        <SIcon
          :name="expanded ? 'cb:chevron-up' : 'cb:chevron-down'"
          aria-hidden="true"
        />
      </button>
      <template v-if="status === 'pending'"
        ><SButton
          shape="rounded"
          :disabled="disabled || settled"
          @click="decide('approve')"
          >{{ t('vs.agent.approve') }}</SButton
        ><SButton
          type="flat"
          shape="rounded"
          :disabled="disabled || settled"
          @click="decide('reject')"
          >{{ t('vs.agent.reject') }}</SButton
        ></template
      >
      <Transition name="s-plan-card-decision" mode="out-in">
        <span
          v-if="status !== 'pending'"
          :key="status"
          role="status"
          class="s-plan-card__decision"
          :class="{
            'is-approved': status === 'approved',
            'is-rejected': status === 'rejected',
          }"
          ><SIcon
            :name="status === 'approved' ? 'cb:checkmark' : 'cb:close'"
            :size="16"
            aria-hidden="true"
          />{{ t(`vs.agent.${status}`) }}</span
        > </Transition
      ><slot name="actions" :status="status" />
    </div>
  </section>
</template>
