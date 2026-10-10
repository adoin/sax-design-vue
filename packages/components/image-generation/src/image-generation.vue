<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'
import { SImage } from '@vuesax-alpha/components/images'
import { clampProgress } from '../../ai-editor/src/agent-shared/utils'
import { imageGenerationEmits, imageGenerationProps } from './image-generation'
import type { AgentStatus } from '../../ai-editor/src/agent-shared/types'

const marker = (status: AgentStatus) =>
  ({ pending: '○', running: '◌', complete: '✓', error: '!', cancelled: '−' })[
    status
  ]
defineOptions({ name: 'SImageGeneration' })
const props = defineProps(imageGenerationProps)
const emit = defineEmits(imageGenerationEmits)
const ns = useNamespace('image-generation')
const shape = useShape()
const { t } = useLocale()
const progressValue = computed(() => clampProgress(props.progress))
const busy = computed(() => props.status === 'running')
</script>

<template>
  <section
    :class="[ns.b(), 's-agent-surface', `is-${shape}`]"
    :aria-busy="busy"
  >
    <div class="s-agent-image-canvas">
      <Transition name="s-agent-reveal" mode="out-in"
        ><SImage
          v-if="status === 'complete' && src"
          :key="src"
          :src="src"
          :alt="alt || t('vs.agent.generatedImage')"
          width="100%"
          height="100%"
          fit="contain"
          preview
          @load="emit('load')"
          @error="emit('image-error')"
        />
        <div
          v-else
          :key="status"
          class="s-agent-image-placeholder"
          :class="{ 'is-running': busy }"
        >
          <span
            class="s-agent-status-marker"
            :aria-label="t(`vs.agent.${status}`)"
            >{{ marker(status) }}</span
          ><slot name="placeholder" :status="status" :progress="progressValue"
            ><span>{{ error || t(`vs.agent.${status}`) }}</span></slot
          >
        </div></Transition
      >
    </div>
    <div class="s-agent-heading">
      <span class="s-agent-muted">{{ resolution }}</span
      ><span v-if="busy">{{ progressValue }}%</span>
    </div>
    <div
      v-if="busy"
      class="s-agent-progress"
      role="progressbar"
      :aria-label="alt || t('vs.agent.generatedImage')"
      :aria-valuenow="progressValue"
      :aria-valuemin="0"
      :aria-valuemax="100"
    >
      <span :style="{ width: `${progressValue}%` }" />
    </div>
    <div class="s-agent-actions">
      <SButton
        v-if="busy"
        type="flat"
        :shape="shape"
        :disabled="disabled"
        @click="emit('cancel')"
        >{{ t('vs.agent.cancel') }}</SButton
      ><SButton
        v-if="status === 'error' || status === 'cancelled'"
        :shape="shape"
        :disabled="disabled"
        @click="emit('retry')"
        >{{ t('vs.agent.retry') }}</SButton
      ><SButton
        v-if="status === 'complete' && src"
        type="flat"
        :shape="shape"
        :disabled="disabled"
        @click="emit('download', src!)"
        >{{ t('vs.agent.download') }}</SButton
      ><slot name="actions" :status="status" />
    </div>
  </section>
</template>
