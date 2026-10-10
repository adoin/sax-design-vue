<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'

import { SPopper } from '@vuesax-alpha/components/popper'
import { chatHistoryEmits, chatHistoryProps } from './chat-history'
import type { AgentHistoryMessage } from '../../ai-editor/src/agent-shared/types'

defineOptions({ name: 'SChatHistory' })
const props = defineProps(chatHistoryProps)
const emit = defineEmits(chatHistoryEmits)
const ns = useNamespace('chat-history')
const shape = useShape()
const { t } = useLocale()
const userMessages = computed(() =>
  props.messages.filter((message) => message.role === 'user'),
)
const select = (message: AgentHistoryMessage) => {
  emit('select', message)
  emit('update:modelValue', false)
}
</script>

<template>
  <div :class="[ns.b(), `is-${shape}`]">
    <div
      v-if="$slots.default"
      class="s-agent-history-transcript"
      :class="{ 'is-open': modelValue }"
      :inert="modelValue ? true : undefined"
      :aria-hidden="modelValue ? 'true' : undefined"
    >
      <slot />
    </div>
    <SPopper
      :visible="modelValue"
      trigger="click"
      :show-arrow="false"
      placement="top-start"
      :popper-class="['s-agent-popper', `is-${shape}`].join(' ')"
      @update:visible="emit('update:modelValue', $event)"
      ><button
        type="button"
        class="s-agent-control s-agent-citation"
        :aria-expanded="modelValue"
        :disabled="!userMessages.length"
      >
        <slot name="trigger"
          >{{ label || t('vs.agent.history') }} ({{
            userMessages.length
          }})</slot
        ></button
      ><template #content
        ><nav :aria-label="label || t('vs.agent.history')">
          <ul class="s-agent-list">
            <li v-for="message in userMessages" :key="message.id">
              <button
                type="button"
                class="s-agent-history-item s-agent-control"
                :class="{ 'is-active': message.id === activeId }"
                :aria-current="message.id === activeId ? 'true' : undefined"
                @click="select(message)"
              >
                <slot name="item" :message="message">{{
                  message.content
                }}</slot>
              </button>
            </li>
          </ul>
        </nav></template
      ></SPopper
    >
  </div>
</template>
