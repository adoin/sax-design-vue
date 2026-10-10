<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'

import { safeAgentHref } from '../../ai-editor/src/agent-shared/utils'
import { reasoningStepsEmits, reasoningStepsProps } from './reasoning-steps'
import type { AgentStatus } from '../../ai-editor/src/agent-shared/types'

const marker = (status: AgentStatus) =>
  ({ pending: '○', running: '◌', complete: '✓', error: '!', cancelled: '−' })[
    status
  ]

defineOptions({ name: 'SReasoningSteps' })
const props = defineProps(reasoningStepsProps)
const emit = defineEmits(reasoningStepsEmits)
const ns = useNamespace('reasoning-steps')
const shape = useShape()
const { t } = useLocale()
const complete = computed(
  () => props.steps.filter((step) => step.status === 'complete').length,
)
const current = computed(() =>
  props.steps.find((step) => step.status === 'running'),
)
</script>

<template>
  <section
    :class="[ns.b(), 's-agent-surface', `is-${shape}`]"
    :aria-busy="!!current"
  >
    <button
      class="s-agent-heading s-agent-control"
      type="button"
      :aria-expanded="expanded"
      @click="emit('update:expanded', !expanded)"
    >
      <span>{{ title || t('vs.agent.reasoning') }}</span
      ><span class="s-agent-muted">{{ complete }}/{{ steps.length }}</span
      ><span aria-hidden="true">{{ expanded ? '−' : '+' }}</span>
    </button>
    <Transition name="s-agent-reveal" mode="out-in">
      <div
        v-if="current"
        :key="current.id"
        class="s-agent-status"
        role="status"
      >
        {{ current.title }}
      </div>
    </Transition>
    <Transition name="s-agent-reveal"
      ><ol v-if="expanded" class="s-agent-list">
        <li
          v-for="step in steps"
          :key="step.id"
          :class="['s-agent-row', `is-${step.status}`]"
        >
          <span
            class="s-agent-status-marker"
            :aria-label="t(`vs.agent.${step.status}`)"
            >{{ marker(step.status) }}</span
          >
          <div class="s-agent-grow">
            <button
              type="button"
              class="s-agent-control s-agent-text-button"
              :disabled="step.disabled"
              @click="emit('step-click', step)"
            >
              {{ step.title }}</button
            ><slot name="step" :step="step"
              ><p v-if="step.description" class="s-agent-muted">
                {{ step.description }}
              </p></slot
            >
          </div>
        </li>
      </ol></Transition
    >
    <div v-if="sources.length" class="s-agent-actions">
      <a
        v-for="source in sources"
        :key="source.id"
        :href="safeAgentHref(source.href)"
        target="_blank"
        rel="noopener noreferrer"
        >{{ source.title }}</a
      >
    </div>
    <slot />
  </section>
</template>
