<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'
import { SMessage } from '@vuesax-alpha/components/message'
import { SVirtualList } from '@vuesax-alpha/components/virtual-list'
import { messageScrollerEmits, messageScrollerProps } from './message-scroller'
import { useMessageScroll } from './use-message-scroll'
import { useMessageHistory } from './use-message-history'
import type { MessageScrollerAction } from './message-scroller'
import type { VirtualListInstance } from '@vuesax-alpha/components/virtual-list'
import type { AgentHistoryMessage } from '../../agent-editor/src/agent-shared/types'

defineOptions({ name: 'SMessageScroller' })
const props = defineProps(messageScrollerProps)
const emit = defineEmits(messageScrollerEmits)
const ns = useNamespace('message-scroller')
const { t } = useLocale()
const virtualList = useTemplateRef<VirtualListInstance>('virtualList')
const plainViewport = useTemplateRef<HTMLElement>('plainViewport')
const plainContent = useTemplateRef<HTMLElement>('plainContent')
const viewport = shallowRef<HTMLElement | null>(null)
const content = shallowRef<HTMLElement | null>(null)
const virtualActive = computed(() => props.virtual && props.items !== undefined)
const heightStyle = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height,
)
const scrollProps = {
  get autoFollow() {
    return props.autoFollow
  },
  get threshold() {
    return props.threshold
  },
  get virtual() {
    return virtualActive.value
  },
}
const {
  following,
  atTop,
  atBottom,
  unread,
  onScroll,
  scrollToTop: plainScrollToTop,
  scrollToBottom: followBottom,
  notifyNewContent,
  pauseFollow,
} = useMessageScroll(viewport, content, scrollProps, emit)
const history = useMessageHistory(viewport, props, emit)
const showHistory = computed(
  () =>
    !!props.loadMore &&
    props.items !== undefined &&
    (history.loading.value ||
      (atTop.value && props.hasMore && !history.exhausted.value)),
)
let disposed = false
let bindVersion = 0
let anchorVersion = 0
let userScrollAt = -Infinity
let userMovingAway: boolean | undefined
let lastScrollTop = 0
const asMessage = (item: unknown) => item as AgentHistoryMessage
const itemKey = (item: unknown) => asMessage(item).id
const feedbackById = shallowRef(new Map<string, 'like' | 'dislike' | null>())
function messageAction(
  item: AgentHistoryMessage,
  index: number,
  action: MessageScrollerAction['action'],
  detail?: Pick<MessageScrollerAction, 'feedback' | 'error'>,
) {
  if (action === 'feedback') {
    const next = new Map(feedbackById.value)
    next.set(item.id, detail?.feedback ?? null)
    feedbackById.value = next
  }
  emit('message-action', { item, index, action, ...detail })
}
const bindViewport = async () => {
  const version = ++bindVersion
  await nextTick()
  if (disposed || version !== bindVersion) return
  const el = virtualActive.value
    ? (virtualList.value?.getScrollElement() ?? null)
    : plainViewport.value
  viewport.value = el
  content.value = virtualActive.value
    ? ((el?.lastElementChild as HTMLElement) ?? null)
    : plainContent.value
  if (virtualActive.value && el) {
    el.tabIndex = 0
    el.setAttribute('role', 'region')
    el.setAttribute('aria-label', props.label || t('vs.agent.messages'))
  }
}
watch(
  [
    virtualList,
    plainViewport,
    plainContent,
    virtualActive,
    () => props.label,
    () => t('vs.agent.messages'),
  ],
  () => bindViewport(),
  { flush: 'post' },
)
onMounted(async () => {
  await bindViewport()
  await nextTick()
  const el = viewport.value
  if (
    !disposed &&
    el &&
    (!props.autoFollow || el.scrollHeight <= el.clientHeight)
  )
    history.maybeLoad()
})
const markUserScroll = (
  event: WheelEvent | KeyboardEvent | PointerEvent | TouchEvent,
) => {
  if (
    event instanceof KeyboardEvent &&
    event.target instanceof Element &&
    event.target.closest('input, textarea, [contenteditable="true"]')
  )
    return
  if (
    event instanceof KeyboardEvent &&
    ![
      'ArrowUp',
      'ArrowDown',
      'PageUp',
      'PageDown',
      'Home',
      'End',
      ' ',
    ].includes(event.key)
  )
    return
  if (event.type === 'pointerdown' || event.type === 'pointermove') {
    if (event.type === 'pointermove' && !(event as PointerEvent).buttons) return
    const el = viewport.value
    if (
      !el ||
      event.target !== el ||
      (event as PointerEvent).clientX < el.getBoundingClientRect().right - 18
    )
      return
  }
  userScrollAt = Date.now()
  userMovingAway =
    event.type === 'wheel'
      ? (event as WheelEvent).deltaY < 0
      : event instanceof KeyboardEvent
        ? ['ArrowUp', 'PageUp', 'Home'].includes(event.key) ||
          (event.key === ' ' && event.shiftKey)
        : undefined
  if (userMovingAway === false && atBottom.value) followBottom(false)
  else pauseFollow()
  anchorVersion++
  if (virtualActive.value && event instanceof KeyboardEvent && !event.altKey) {
    if (event.key === 'Home') {
      event.preventDefault()
      scrollToTop()
    } else if (event.key === 'End') {
      event.preventDefault()
      scrollToBottom(false)
    }
  }
}
const scrollToTop = () => {
  if (!virtualActive.value) {
    plainScrollToTop()
    return
  }
  pauseFollow()
  userMovingAway = true
  userScrollAt = Date.now()
  anchorVersion++
  virtualList.value?.scrollToIndex(0, 'start')
  history.maybeLoad()
}
const handleScroll = () => {
  const top = viewport.value?.scrollTop ?? 0
  const movingUp = top < lastScrollTop - 0.5
  const userActive = Date.now() - userScrollAt <= 250
  onScroll(
    virtualActive.value && following.value && !userActive,
    virtualActive.value &&
      ((userActive && (userMovingAway ?? movingUp)) ||
        (!following.value && movingUp)),
  )
  lastScrollTop = top
  const el = viewport.value
  if (!following.value || (el && el.scrollHeight <= el.clientHeight))
    history.maybeLoad()
}
const scrollToBottom = (smooth = true) => {
  userScrollAt = -Infinity
  followBottom(virtualActive.value ? false : smooth)
  if (virtualActive.value && props.items?.length)
    virtualList.value?.scrollToIndex(props.items.length - 1, 'end')
}
watch(
  () => props.items?.map((item) => item.id),
  async (keys, old) => {
    if (!keys || !old?.length) return
    if (keys[keys.length - 1] !== old[old.length - 1]) notifyNewContent()
    if (
      !virtualActive.value ||
      following.value ||
      (keys.length === old.length &&
        keys.every((key, index) => key === old[index]))
    )
      return
    const el = viewport.value
    if (!el) return
    const bounds = el.getBoundingClientRect()
    const top = bounds.top
    const row = [...el.querySelectorAll<HTMLElement>('[data-message-id]')].find(
      (item) => {
        const rect = item.getBoundingClientRect()
        return rect.bottom > top && rect.top < bounds.bottom
      },
    )
    if (!row) return
    const id = row.dataset.messageId
    const index = keys.indexOf(id ?? '')
    if (index < 0) return
    const delta = row.getBoundingClientRect().top - top
    const version = ++anchorVersion
    await nextTick()
    if (disposed || version !== anchorVersion) return
    virtualList.value?.scrollToIndex(index, 'start')
    await nextTick()
    virtualList.value?.measureVisible()
    await nextTick()
    if (disposed || version !== anchorVersion) return
    const nextRow = [
      ...el.querySelectorAll<HTMLElement>('[data-message-id]'),
    ].find((item) => item.dataset.messageId === id)
    if (nextRow)
      virtualList.value?.scrollBy(
        nextRow.getBoundingClientRect().top -
          el.getBoundingClientRect().top -
          delta,
      )
  },
  { flush: 'pre' },
)
watch(
  () => props.items?.[props.items.length - 1]?.content,
  (text, old) => {
    if (old !== undefined && text !== old) notifyNewContent()
  },
)
onBeforeUnmount(() => {
  disposed = true
  bindVersion++
  anchorVersion++
})
defineExpose({
  scrollToTop,
  scrollToBottom,
  following,
  viewport,
  loadMore: history.request,
})
</script>

<template>
  <section
    :class="[ns.b(), { 'is-away-top': !atTop, 'is-away-bottom': !atBottom }]"
  >
    <SVirtualList
      v-if="virtualActive"
      ref="virtualList"
      class="s-message-scroller__virtual"
      :items="items"
      :height="height"
      :estimate-size="estimatedItemHeight"
      :overscan="overscan"
      :dynamic="true"
      :retain-max-size="false"
      :item-key="itemKey"
      @scroll="handleScroll"
      @wheel.capture="markUserScroll"
      @keydown.capture="markUserScroll"
      @pointerdown.capture="markUserScroll"
      @pointermove.capture="markUserScroll"
      @touchmove.passive.capture="markUserScroll"
    >
      <template #default="{ item, index }">
        <div
          class="s-message-scroller__item"
          :data-message-id="asMessage(item).id"
        >
          <slot
            name="message"
            :item="asMessage(item)"
            :index="index"
            :following="following"
            ><SMessage
              :role="asMessage(item).role"
              :content="asMessage(item).content"
              :feedback="feedbackById.get(asMessage(item).id)"
              @copy="messageAction(asMessage(item), index, 'copy')"
              @edit="messageAction(asMessage(item), index, 'edit')"
              @regenerate="messageAction(asMessage(item), index, 'regenerate')"
              @update:feedback="
                messageAction(asMessage(item), index, 'feedback', {
                  feedback: $event,
                })
              "
              @copy-error="
                messageAction(asMessage(item), index, 'copy-error', {
                  error: $event,
                })
              "
          /></slot>
        </div>
      </template>
    </SVirtualList>
    <div
      v-else
      ref="plainViewport"
      class="s-agent-viewport s-agent-control"
      :style="{ height: heightStyle }"
      tabindex="0"
      role="region"
      :aria-label="label || t('vs.agent.messages')"
      @scroll="handleScroll"
    >
      <div ref="plainContent" class="s-agent-transcript">
        <template v-if="items"
          ><div
            v-for="(item, index) in items"
            :key="item.id"
            :data-message-id="item.id"
          >
            <slot
              name="message"
              :item="item"
              :index="index"
              :following="following"
              ><SMessage
                :role="item.role"
                :content="item.content"
                :feedback="feedbackById.get(asMessage(item).id)"
                @copy="messageAction(asMessage(item), index, 'copy')"
                @edit="messageAction(asMessage(item), index, 'edit')"
                @regenerate="
                  messageAction(asMessage(item), index, 'regenerate')
                "
                @update:feedback="
                  messageAction(asMessage(item), index, 'feedback', {
                    feedback: $event,
                  })
                "
                @copy-error="
                  messageAction(asMessage(item), index, 'copy-error', {
                    error: $event,
                  })
                "
            /></slot></div
        ></template>
        <slot
          v-else
          :following="following"
          :scroll-to-bottom="scrollToBottom"
        />
      </div>
    </div>
    <div v-if="showHistory" class="s-message-scroller__history">
      <SButton
        size="small"
        type="flat"
        shape="rounded"
        :loading="history.loading.value"
        @click="history.request()"
        >{{
          t(
            history.failed.value
              ? 'vs.agent.retryHistory'
              : history.loading.value
                ? 'vs.agent.loadingHistory'
                : 'vs.agent.loadHistory',
          )
        }}</SButton
      >
      <span v-if="history.failed.value" role="status" class="s-agent-sr-only">{{
        t('vs.agent.historyLoadFailed')
      }}</span>
    </div>
    <div class="s-agent-scroll-controls">
      <Transition name="s-message-latest">
        <SButton
          v-if="!atBottom || (!following && autoFollow)"
          class="s-message-scroller__latest"
          icon
          :aria-label="t('vs.agent.latest')"
          type="flat"
          shape="rounded"
          @click="scrollToBottom()"
          ><svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 4.5v14M6.5 13l5.5 5.5 5.5-5.5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
          ><span class="s-agent-sr-only">{{ t('vs.agent.latest') }}</span
          ><span v-if="unread" class="s-agent-unread-dot" aria-hidden="true"
        /></SButton>
      </Transition>
      <slot
        name="controls"
        :following="following"
        :unread="unread"
        :scroll-to-bottom="scrollToBottom"
        :scroll-to-top="scrollToTop"
      />
    </div>
  </section>
</template>
