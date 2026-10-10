<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'
import { SIcon } from '@vuesax-alpha/components/icon'
import { messageScrollerEmits, messageScrollerProps } from './message-scroller'
import { useMessageScroll } from './use-message-scroll'

defineOptions({ name: 'SMessageScroller' })
const props = defineProps(messageScrollerProps)
const emit = defineEmits(messageScrollerEmits)
const ns = useNamespace('message-scroller')
const { t } = useLocale()
const viewport = useTemplateRef<HTMLElement>('viewport')
const content = useTemplateRef<HTMLElement>('content')
const heightStyle = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)
const {
  following,
  atTop,
  atBottom,
  unread,
  onScroll,
  scrollToTop,
  scrollToBottom,
} = useMessageScroll(viewport, content, props, emit)
defineExpose({ scrollToTop, scrollToBottom, following, viewport })
</script>

<template>
  <section
    :class="[ns.b(), { 'is-away-top': !atTop, 'is-away-bottom': !atBottom }]"
  >
    <div
      ref="viewport"
      class="s-agent-viewport s-agent-control"
      :style="{ height: heightStyle }"
      tabindex="0"
      role="region"
      :aria-label="label || t('vs.agent.messages')"
      @scroll="onScroll"
    >
      <div ref="content" class="s-agent-transcript">
        <slot :following="following" :scroll-to-bottom="scrollToBottom" />
      </div>
    </div>
    <div class="s-agent-scroll-controls">
      <SButton
        v-if="!atTop"
        icon
        size="small"
        type="flat"
        :aria-label="t('vs.agent.oldest')"
        shape="rounded"
        @click="scrollToTop"
        ><SIcon name="cb:arrow-up" /><span class="s-agent-sr-only">{{
          t('vs.agent.oldest')
        }}</span></SButton
      ><SButton
        v-if="!atBottom"
        icon
        size="small"
        :aria-label="t('vs.agent.latest')"
        type="flat"
        shape="rounded"
        @click="scrollToBottom()"
        ><SIcon name="cb:arrow-down" /><span class="s-agent-sr-only">{{
          t('vs.agent.latest')
        }}</span
        ><span
          v-if="unread"
          class="s-agent-unread-dot"
          aria-hidden="true" /></SButton
      ><slot
        name="controls"
        :following="following"
        :unread="unread"
        :scroll-to-bottom="scrollToBottom"
        :scroll-to-top="scrollToTop"
      />
    </div>
  </section>
</template>
