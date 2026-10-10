<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'
import { messageScrollerEmits, messageScrollerProps } from './message-scroller'
import { useMessageScroll } from './use-message-scroll'

defineOptions({ name: 'SMessageScroller' })
const props = defineProps(messageScrollerProps)
const emit = defineEmits(messageScrollerEmits)
const ns = useNamespace('message-scroller')
const shape = useShape()
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
  <section :class="[ns.b(), `is-${shape}`]">
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
      <SButton v-if="!atTop" type="flat" :shape="shape" @click="scrollToTop">{{
        t('vs.agent.oldest')
      }}</SButton
      ><SButton
        v-if="!atBottom"
        type="flat"
        :shape="shape"
        @click="scrollToBottom()"
        >{{ t('vs.agent.latest')
        }}<span v-if="unread" aria-hidden="true"> •</span></SButton
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
