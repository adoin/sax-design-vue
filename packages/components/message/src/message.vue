<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'

import AgentIcon from '../../agent-editor/src/agent-shared/agent-icon.vue'
import { useAgentCopy } from '../../agent-editor/src/agent-shared/use-copy'
import MessageAction from './message-action.vue'
import { messageEmits, messageProps } from './message'
defineOptions({ name: 'SMessage' })
const props = defineProps(messageProps)
const emit = defineEmits(messageEmits)
const ns = useNamespace('message')
const { t } = useLocale()
const showActions = computed(
  () => props.actions ?? ['assistant', 'user'].includes(props.role),
)
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
    <div
      v-if="author || $slots.avatar || role === 'assistant'"
      class="s-agent-message-avatar"
    >
      <slot name="avatar">
        <AgentIcon v-if="role === 'assistant'" :src="agentIcon" :busy="loading"
          ><template v-if="$slots['agent-icon']" #default
            ><slot name="agent-icon" :busy="loading" /></template
        ></AgentIcon>
        <template v-else>{{
          (author || t(`vs.agent.${role}`)).slice(0, 2)
        }}</template>
      </slot>
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
        <slot name="actions" :copy="copy" :feedback="feedback">
          <MessageAction
            :label="copied ? t('vs.agent.copied') : t('vs.agent.copy')"
            :icon="copied ? 'cb:checkmark' : 'cb:copy'"
            :disabled="disabled || loading"
            @click="copy"
          />
          <template v-if="role === 'assistant'">
            <MessageAction
              :label="t('vs.agent.like')"
              icon="cb:thumbs-up"
              :active="feedback === 'like'"
              :disabled="disabled || loading"
              @click="vote('like')"
            />
            <MessageAction
              :label="t('vs.agent.dislike')"
              icon="cb:thumbs-down"
              :active="feedback === 'dislike'"
              :disabled="disabled || loading"
              @click="vote('dislike')"
            />
            <MessageAction
              :label="t('vs.agent.regenerate')"
              icon="cb:renew"
              :disabled="disabled || loading"
              @click="emit('regenerate')"
            />
          </template>
          <MessageAction
            v-else-if="role === 'user'"
            :label="t('vs.agent.editMessage')"
            icon="cb:edit"
            :disabled="disabled || loading"
            @click="emit('edit')"
          />
        </slot>
      </div>
      <span class="s-agent-sr-only" role="status">{{
        copied ? t('vs.agent.copied') : loading ? t('vs.agent.running') : ''
      }}</span>
    </div>
  </article>
</template>
