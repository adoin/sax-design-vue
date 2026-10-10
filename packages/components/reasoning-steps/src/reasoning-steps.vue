<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'

import { safeAgentHref } from '../../ai-editor/src/agent-shared/utils'
import { reasoningStepsEmits, reasoningStepsProps } from './reasoning-steps'
import type { AgentStatus } from '../../ai-editor/src/agent-shared/types'

const marker = (status: AgentStatus) =>
  ({
    pending: 'cb:time',
    running: 'cb:draggable',
    complete: 'cb:checkmark',
    error: 'cb:warning',
    cancelled: 'cb:close',
  })[status]

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
const summary = computed(
  () =>
    current.value ??
    props.steps.find((step) => step.status === 'error') ??
    props.steps.at(-1),
)
defineSlots<{
  default(): unknown
  step(props: {
    step: import('../../ai-editor/src/agent-shared/types').AgentTask
  }): unknown
  'source-icon'(props: {
    source: import('../../ai-editor/src/agent-shared/types').AgentSource
  }): unknown
}>()
const finished = computed(
  () =>
    props.steps.length > 0 &&
    props.steps.every((step) => step.status === 'complete'),
)
const startedAt = shallowRef<number>()
const elapsed = shallowRef(0)
watch(
  () => !!current.value,
  (running) => {
    if (running && startedAt.value === undefined) startedAt.value = Date.now()
    if (!running && startedAt.value !== undefined)
      elapsed.value = Math.round((Date.now() - startedAt.value) / 1000)
  },
  { immediate: true },
)
watch(finished, (done, previous) => {
  if (done) emit('update:expanded', false)
  else if (previous) {
    startedAt.value = Date.now()
    elapsed.value = 0
  }
})
const summaryText = computed(
  () =>
    props.title ||
    (finished.value
      ? t('vs.agent.thoughtDuration', {
          seconds: Math.max(0, Math.round(props.duration ?? elapsed.value)),
        })
      : summary.value?.title || t('vs.agent.reasoning')),
)
</script>

<template>
  <section :class="[ns.b(), `is-${shape}`]" :aria-busy="!!current">
    <button
      class="s-reasoning-steps__summary s-agent-control"
      type="button"
      :aria-expanded="expanded"
      @click="emit('update:expanded', !expanded)"
    >
      <SIcon
        v-if="!finished"
        class="s-reasoning-steps__indicator"
        :class="{ 'is-running': !!current }"
        :name="marker(summary?.status ?? 'pending')"
        aria-hidden="true"
      />
      <Transition name="s-reasoning-label" mode="out-in">
        <span :key="summaryText" class="s-reasoning-steps__summary-text">{{
          summaryText
        }}</span>
      </Transition>
      <span class="s-reasoning-steps__count"
        >{{ complete }}/{{ steps.length }}</span
      >
      <SIcon
        class="s-reasoning-steps__chevron"
        :class="{ 'is-finished': finished }"
        :name="expanded ? 'cb:chevron-up' : 'cb:chevron-down'"
        aria-hidden="true"
      />
    </button>
    <span class="s-reasoning-steps__announcement" role="status">{{
      summaryText
    }}</span>
    <Transition name="s-agent-reveal"
      ><ol v-if="expanded && !reasoning.length" class="s-agent-list">
        <li
          v-for="step in steps"
          :key="step.id"
          :class="['s-agent-row', `is-${step.status}`]"
        >
          <span
            class="s-agent-status-marker"
            :aria-label="t(`vs.agent.${step.status}`)"
            ><SIcon :name="marker(step.status)" aria-hidden="true"
          /></span>
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
    <Transition name="s-agent-reveal" mode="out-in">
      <div
        v-if="reasoning.length && (!finished || expanded)"
        key="reasoning"
        class="s-reasoning-steps__reasoning"
        :aria-live="finished ? 'off' : 'polite'"
        aria-relevant="additions"
      >
        <p
          v-for="(paragraph, index) in reasoning"
          :key="index"
          class="s-reasoning-steps__paragraph"
        >
          {{ paragraph }}
        </p>
      </div>
      <div
        v-else-if="sources.length && !finished && !reasoning.length"
        key="sources"
        class="s-reasoning-steps__sources"
      >
        <a
          v-for="source in sources"
          :key="source.id"
          class="s-reasoning-steps__source s-agent-control"
          :href="safeAgentHref(source.href)"
          target="_blank"
          rel="noopener noreferrer"
          ><span class="s-reasoning-steps__source-icon" aria-hidden="true"
            ><slot name="source-icon" :source="source"
              ><img v-if="source.iconSrc" :src="source.iconSrc" alt="" /><SIcon
                v-else
                :name="source.icon || 'cb:document'" /></slot></span
          ><span>{{ source.title }}</span></a
        >
      </div>
    </Transition>
    <slot />
  </section>
</template>
