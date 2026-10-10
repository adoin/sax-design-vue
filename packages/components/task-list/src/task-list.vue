<script setup lang="ts">
import { computed } from 'vue'
import { SIcon, SLogoLoading } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'

import { clampProgress } from '../../ai-editor/src/agent-shared/utils'
import { taskListEmits, taskListProps } from './task-list'
import type { AgentStatus } from '../../ai-editor/src/agent-shared/types'

const marker = (status: AgentStatus) =>
  ({
    pending: 'cb:radio-button',
    running: 'cb:arrow-right',
    complete: 'cb:checkmark-filled',
    error: 'cb:warning',
    cancelled: 'cb:close',
  })[status]

defineOptions({ name: 'STaskList' })
const props = defineProps(taskListProps)
const emit = defineEmits(taskListEmits)
const ns = useNamespace('task-list')
const { t } = useLocale()
const complete = computed(
  () => props.tasks.filter((task) => task.status === 'complete').length,
)
</script>

<template>
  <section :class="[ns.b(), 's-agent-surface']">
    <button
      type="button"
      class="s-agent-heading s-agent-control"
      :aria-expanded="expanded"
      @click="emit('update:expanded', !expanded)"
    >
      <SLogoLoading
        v-if="tasks.some((task) => task.status === 'running')"
        :size="14"
        shape="rounded"
        aria-hidden="true"
      /><SIcon v-else name="cb:task-complete" aria-hidden="true" /><span
        class="s-agent-grow"
        >{{ title || t('vs.agent.tasks') }}</span
      ><span class="s-agent-muted">{{ complete }}/{{ tasks.length }}</span
      ><SIcon
        :name="expanded ? 'cb:chevron-up' : 'cb:chevron-down'"
        aria-hidden="true"
      />
    </button>
    <Transition name="s-agent-reveal"
      ><ul v-if="expanded" class="s-agent-list">
        <li
          v-for="task in tasks"
          :key="task.id"
          :class="['s-agent-row', `is-${task.status}`]"
        >
          <span
            class="s-agent-status-marker"
            :aria-label="t(`vs.agent.${task.status}`)"
            ><SIcon :name="marker(task.status)" aria-hidden="true"
          /></span>
          <div class="s-agent-grow">
            <button
              v-if="interactive"
              class="s-agent-control s-agent-text-button"
              type="button"
              :disabled="disabled || task.disabled"
              @click="emit('task-click', task)"
            >
              {{ task.title }}</button
            ><span v-else>{{ task.title }}</span>
            <slot name="task" :task="task"
              ><p v-if="task.description" class="s-agent-muted">
                {{ task.description }}
              </p></slot
            >
            <div
              v-if="task.progress !== undefined"
              class="s-agent-task-progress"
              role="progressbar"
              :aria-label="task.title"
              :aria-valuenow="clampProgress(task.progress)"
              :aria-valuemin="0"
              :aria-valuemax="100"
            >
              <span>{{ clampProgress(task.progress) }}%</span>
            </div>
          </div>
        </li>
      </ul></Transition
    ><slot />
  </section>
</template>
