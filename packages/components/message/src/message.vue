<script setup lang="ts">
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'

import { useAgentCopy } from '../../ai-editor/src/agent-shared/use-copy'
import { messageEmits, messageProps } from './message'
defineOptions({ name: 'SMessage' })
const props = defineProps(messageProps)
const emit = defineEmits(messageEmits)
const ns = useNamespace('message')
const shape = useShape()
const { t } = useLocale()
const { copied, copy } = useAgentCopy(
  () => props.content,
  () => emit('copy'),
  (error) => emit('copy-error', error),
)
const vote = (value: 'like' | 'dislike') => {
  if (!props.disabled && !props.loading)
    emit('update:feedback', props.feedback === value ? null : value)
}
</script>

<template>
  <article
    :class="[ns.b(), 's-agent-message', `is-${role}`, `is-${shape}`]"
    :aria-busy="loading"
  >
    <div class="s-agent-message-avatar">
      <slot name="avatar">{{
        (author || t(`vs.agent.${role}`)).slice(0, 2)
      }}</slot>
    </div>
    <div class="s-agent-grow">
      <header class="s-agent-heading">
        <slot name="header"
          ><strong>{{ author || t(`vs.agent.${role}`) }}</strong
          ><button
            v-if="sentAt"
            type="button"
            class="s-agent-control s-agent-time-toggle"
            :aria-expanded="showTime"
            :aria-label="t('vs.agent.showTime')"
            @click="emit('update:showTime', !showTime)"
          >
            ···
          </button></slot
        >
      </header>
      <div class="s-agent-message-body">
        <slot
          ><span class="s-agent-stream">{{ content }}</span
          ><span v-if="loading" class="s-agent-caret" aria-hidden="true"
        /></slot>
      </div>
      <Transition name="s-agent-reveal"
        ><time
          v-if="showTime && sentAt"
          :datetime="datetime"
          class="s-agent-muted"
          >{{ sentAt }}</time
        ></Transition
      >
      <div v-if="actions" class="s-agent-actions">
        <slot name="actions" :copy="copy" :feedback="feedback"
          ><SButton
            type="flat"
            :shape="shape"
            :disabled="disabled || loading"
            @click="copy"
            >{{ copied ? t('vs.agent.copied') : t('vs.agent.copy') }}</SButton
          ><template v-if="role === 'assistant'"
            ><SButton
              type="flat"
              :shape="shape"
              :active="feedback === 'like'"
              :aria-pressed="feedback === 'like'"
              :disabled="disabled || loading"
              @click="vote('like')"
              >{{ t('vs.agent.like') }}</SButton
            ><SButton
              type="flat"
              :shape="shape"
              :active="feedback === 'dislike'"
              :aria-pressed="feedback === 'dislike'"
              :disabled="disabled || loading"
              @click="vote('dislike')"
              >{{ t('vs.agent.dislike') }}</SButton
            ><SButton
              type="flat"
              :shape="shape"
              :disabled="disabled || loading"
              @click="emit('regenerate')"
              >{{ t('vs.agent.regenerate') }}</SButton
            ></template
          ></slot
        >
      </div>
      <span class="s-agent-sr-only" role="status">{{
        copied ? t('vs.agent.copied') : loading ? t('vs.agent.running') : ''
      }}</span>
    </div>
  </article>
</template>
