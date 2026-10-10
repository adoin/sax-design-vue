<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
} from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'

import { SPopper } from '@vuesax-alpha/components/popper'
import { useHistoryNavigation } from './use-history-navigation'
import { chatHistoryEmits, chatHistoryProps } from './chat-history'
import type { AgentHistoryMessage } from '../../ai-editor/src/agent-shared/types'

defineOptions({ name: 'SChatHistory' })
const props = defineProps(chatHistoryProps)
const emit = defineEmits(chatHistoryEmits)
const ns = useNamespace('chat-history')
const { t } = useLocale()
const root = useTemplateRef<HTMLElement>('root')
const transcript = useTemplateRef<HTMLElement>('transcript')
const panelWidth = shallowRef(320)
const panelHeight = shallowRef(320)
let observer: ResizeObserver | undefined
onMounted(() => {
  const measure = () => {
    panelWidth.value = root.value?.clientWidth || 320
    panelHeight.value = transcript.value?.clientHeight || 320
  }
  measure()
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(measure)
    if (root.value) observer.observe(root.value)
  }
})
onBeforeUnmount(() => observer?.disconnect())
const userMessages = computed(() =>
  props.messages.filter((message) => message.role === 'user'),
)
const navigate = useHistoryNavigation()
const select = async (message: AgentHistoryMessage) => {
  emit('select', message)
  emit('update:modelValue', false)
  await nextTick()
  if (!root.value) return
  const target = props.messageTarget
    ? props.messageTarget(message)
    : Array.from(
        transcript.value?.querySelectorAll<HTMLElement>('[data-message-id]') ??
          [],
      ).find((element) => element.dataset.messageId === message.id)
  if (target) navigate(target)
}
</script>

<template>
  <div ref="root" :class="[ns.b()]">
    <div
      v-if="$slots.default"
      ref="transcript"
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
      :popper-class="['s-agent-popper', 's-agent-history-panel'].join(' ')"
      :popper-style="{
        width: `${panelWidth}px`,
        maxHeight: `${panelHeight}px`,
      }"
      @update:visible="emit('update:modelValue', $event)"
      ><button
        type="button"
        class="s-agent-control s-agent-citation"
        :aria-expanded="modelValue"
        :disabled="!userMessages.length"
      >
        <slot name="trigger"
          ><SIcon name="cb:recently-viewed" aria-hidden="true" />{{
            label || t('vs.agent.history')
          }}
          ({{ userMessages.length }})</slot
        ></button
      ><template #content
        ><nav
          :aria-label="label || t('vs.agent.history')"
          @keydown.esc.stop.prevent="emit('update:modelValue', false)"
        >
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
