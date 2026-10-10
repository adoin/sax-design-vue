<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'
import { SIcon } from '@vuesax-alpha/components/icon'

import { useAgentCopy } from '../../ai-editor/src/agent-shared/use-copy'
import { messageEmits, messageProps } from './message'
defineOptions({ name: 'SMessage' })
const props = defineProps(messageProps)
const emit = defineEmits(messageEmits)
const ns = useNamespace('message')
const { t } = useLocale()
const showActions = computed(() => props.actions ?? props.role === 'assistant')
const toggleTime = (event: Event) => {
  const target = event.target
  if (
    target instanceof Element &&
    target !== event.currentTarget &&
    target.closest('a, button, input, textarea, select')
  )
    return
  if (props.sentAt && !props.disabled && !props.loading)
    emit('update:showTime', !props.showTime)
}
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
    :class="[ns.b(), 's-agent-message', `is-${role}`]"
    :aria-busy="loading"
  >
    <div v-if="author || $slots.avatar" class="s-agent-message-avatar">
      <slot name="avatar">{{
        (author || t(`vs.agent.${role}`)).slice(0, 2)
      }}</slot>
    </div>
    <div class="s-agent-grow">
      <header
        v-if="$slots.header || (author && role !== 'user')"
        class="s-agent-heading"
      >
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
      <div
        class="s-agent-message-body"
        :class="{ 'is-time-interactive': !!sentAt }"
        :role="sentAt ? 'button' : undefined"
        :tabindex="sentAt && !disabled ? 0 : undefined"
        :aria-label="sentAt ? t('vs.agent.showTime') : undefined"
        :aria-expanded="sentAt ? showTime : undefined"
        @click="toggleTime"
        @keydown.enter.self.prevent="toggleTime($event)"
        @keydown.space.self.prevent="toggleTime($event)"
      >
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
      <div v-if="showActions" class="s-agent-actions">
        <slot name="actions" :copy="copy" :feedback="feedback"
          ><SButton
            icon
            size="small"
            :aria-label="copied ? t('vs.agent.copied') : t('vs.agent.copy')"
            type="flat"
            shape="rounded"
            :disabled="disabled || loading"
            @click="copy"
            ><SIcon :name="copied ? 'cb:checkmark' : 'cb:copy'" /><span
              class="s-agent-sr-only"
              >{{ copied ? t('vs.agent.copied') : t('vs.agent.copy') }}</span
            ></SButton
          ><template v-if="role === 'assistant'"
            ><SButton
              icon
              size="small"
              :aria-label="t('vs.agent.like')"
              type="flat"
              shape="rounded"
              :active="feedback === 'like'"
              :aria-pressed="feedback === 'like'"
              :disabled="disabled || loading"
              @click="vote('like')"
              ><SIcon name="cb:thumbs-up" /><span class="s-agent-sr-only">{{
                t('vs.agent.like')
              }}</span></SButton
            ><SButton
              icon
              size="small"
              :aria-label="t('vs.agent.dislike')"
              type="flat"
              shape="rounded"
              :active="feedback === 'dislike'"
              :aria-pressed="feedback === 'dislike'"
              :disabled="disabled || loading"
              @click="vote('dislike')"
              ><SIcon name="cb:thumbs-down" /><span class="s-agent-sr-only">{{
                t('vs.agent.dislike')
              }}</span></SButton
            ><SButton
              icon
              size="small"
              :aria-label="t('vs.agent.regenerate')"
              type="flat"
              shape="rounded"
              :disabled="disabled || loading"
              @click="emit('regenerate')"
              ><SIcon name="cb:renew" /><span class="s-agent-sr-only">{{
                t('vs.agent.regenerate')
              }}</span></SButton
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
