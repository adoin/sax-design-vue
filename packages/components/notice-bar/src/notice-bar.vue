<script setup lang="ts">
import {
  computed,
  onDeactivated,
  shallowRef,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'
import { IconClose, SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace, useShape, useSize } from '@vuesax-alpha/hooks'
import { getCssColor } from '@vuesax-alpha/utils'
import { noticeBarEmits, noticeBarProps } from './notice-bar'
import { useNoticePlayback } from './use-notice-playback'
import { useNoticeState } from './use-notice-state'
import { useNoticeMarquee } from './use-notice-marquee'
import type { NoticeBarSlotScope } from './notice-bar'

defineOptions({ name: 'SNoticeBar', inheritAttrs: false })
const props = defineProps(noticeBarProps)
const emit = defineEmits(noticeBarEmits)
const slots = defineSlots<{
  default?(scope: NoticeBarSlotScope): unknown
  content?(scope: NoticeBarSlotScope): unknown
  icon?(scope: NoticeBarSlotScope): unknown
  prefix?(scope: NoticeBarSlotScope): unknown
  suffix?(scope: NoticeBarSlotScope): unknown
  actions?(scope: NoticeBarSlotScope): unknown
  navigation?(scope: NoticeBarSlotScope): unknown
  'close-icon'?(scope: NoticeBarSlotScope): unknown
}>()
const attrs = useAttrs()
const ns = useNamespace('notice-bar')
const { t } = useLocale()
const shape = useShape()
const size = useSize()
const root = useTemplateRef<HTMLElement>('root')
const viewport = useTemplateRef<HTMLElement>('viewport')
const content = useTemplateRef<HTMLElement>('content')
const copy = useTemplateRef<HTMLElement>('copy')
const track = useTemplateRef<HTMLElement>('track')
const hovering = shallowRef(false)
const focused = shallowRef(false)
const manualPause = shallowRef(false)
const playback = useNoticePlayback(
  root,
  () =>
    props.paused ||
    manualPause.value ||
    (props.pauseOnHover && hovering.value) ||
    (props.pauseOnFocus && focused.value),
  () => props.reducedMotion,
)
const { paused, reducedMotion } = playback
const readingTime = shallowRef(0)
const state = useNoticeState(props, emit, paused, readingTime)
const { visible, index, notices, item, next, prev, close, open, goTo } = state
const clearGestures = () => {
  hovering.value = false
  focused.value = false
}
watch(visible, (shown) => {
  if (!shown) clearGestures()
})
onDeactivated(clearGestures)
const revision = computed(() => [index.value, item.value.content])
const marquee = useNoticeMarquee(
  props,
  viewport,
  content,
  copy,
  track,
  computed(() => visible.value && !reducedMotion.value),
  revision,
)
const { scrolling } = marquee
watch([scrolling, marquee.duration, () => props.delay], () => {
  readingTime.value = scrolling.value
    ? Math.max(0, props.delay) + marquee.duration.value * 1000
    : 0
})
const tone = computed(() => item.value.type ?? props.type)
const icon = computed(() => item.value.icon ?? props.icon)
const href = computed(() =>
  item.value.disabled ? undefined : (item.value.href ?? props.href),
)
const target = computed(() => item.value.target ?? props.target)
const interactive = computed(
  () => !item.value.disabled && (href.value || props.clickable),
)
const bodyTag = computed(() =>
  href.value ? 'a' : interactive.value ? 'button' : 'div',
)
const canPrev = computed(
  () => notices.value.length > 1 && (props.loop || index.value > 0),
)
const canNext = computed(
  () =>
    notices.value.length > 1 &&
    (props.loop || index.value < notices.value.length - 1),
)
const styles = computed(() => ({
  '--sax-notice-color': props.color
    ? getCssColor(props.color)
    : tone.value === 'info'
      ? 'var(--sax-css-info)'
      : getCssColor(tone.value === 'warning' ? 'warn' : tone.value),
  '--sax-notice-text': props.textColor
    ? getCssColor(props.textColor)
    : undefined,
  ...marquee.styles.value,
}))
const scope = computed<NoticeBarSlotScope>(() => ({
  item: item.value,
  index: index.value,
  count: notices.value.length,
  paused: paused.value,
  scrolling: scrolling.value,
  close,
  next,
  prev,
}))
const pause = () => {
  manualPause.value = true
}
const resume = () => {
  manualPause.value = false
}
const reset = () => {
  goTo(0)
  manualPause.value = false
  marquee.reset()
  state.restart()
}
const focusOut = (event: FocusEvent) => {
  if (!root.value?.contains(event.relatedTarget as Node | null))
    focused.value = false
}
defineExpose({
  close,
  open,
  next,
  prev,
  goTo,
  pause,
  resume,
  reset,
  visible,
  activeIndex: index,
  paused,
  scrolling,
})
</script>

<template>
  <Transition name="s-notice-bar-fade" @after-leave="emit('closed')">
    <div
      v-if="visible"
      ref="root"
      v-bind="attrs"
      :class="[
        ns.b(),
        ns.m(tone),
        ns.m(size || 'default'),
        ns.is(shape),
        ns.is(props.variant),
        ns.is('paused', paused),
        ns.is('wrapable', wrapable || reducedMotion),
        ns.is('motion-forced', props.reducedMotion === false),
        ns.is('reduced-motion', reducedMotion),
      ]"
      :style="styles"
      :role="(attrs.role as string) || 'status'"
      :aria-live="
        live ||
        (attrs.role === 'alert'
          ? 'assertive'
          : notices.length > 1
            ? 'off'
            : 'polite')
      "
      aria-atomic="true"
      @click="emit('click', $event)"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
      @focusin="focused = true"
      @focusout="focusOut"
    >
      <div
        v-if="slots.icon || (icon !== false && icon !== '')"
        :class="ns.e('icon')"
        aria-hidden="true"
      >
        <slot name="icon" v-bind="scope">
          <SIcon v-if="typeof icon === 'string'" :name="icon" :size="20" />
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            width="20"
            height="20"
            focusable="false"
          >
            <path
              d="M8 18H16M10 21H14M5 16C7 14 7 12 7 9A5 5 0 0 1 17 9C17 12 17 14 19 16Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </slot>
      </div>
      <div v-if="slots.prefix" :class="ns.e('prefix')">
        <slot name="prefix" v-bind="scope" />
      </div>
      <component
        :is="bodyTag"
        :class="[ns.e('body'), ns.is('interactive', !!interactive)]"
        :href="href"
        :target="href ? target : undefined"
        :rel="href && target === '_blank' ? 'noopener noreferrer' : undefined"
        :type="bodyTag === 'button' ? 'button' : undefined"
        :aria-disabled="item.disabled || undefined"
      >
        <div ref="viewport" :class="ns.e('viewport')">
          <Transition
            name="s-notice-bar-item"
            :mode="!interactive && !reducedMotion ? 'out-in' : undefined"
            :css="!interactive && !reducedMotion"
          >
            <div :key="index" :class="ns.e('item')">
              <div
                ref="track"
                :class="[ns.e('track'), ns.is('moving', scrolling)]"
                @animationiteration="scrolling && emit('scrollEnd')"
              >
                <span
                  ref="content"
                  :class="ns.e('content')"
                  :title="!scrolling && !wrapable ? item.content : undefined"
                  ><slot name="content" v-bind="scope"
                    ><slot v-bind="scope">{{ item.content }}</slot></slot
                  ></span
                >
                <span
                  v-if="scrolling"
                  ref="copy"
                  :class="[ns.e('content'), ns.e('copy')]"
                  aria-hidden="true"
                  inert
                />
              </div>
            </div>
          </Transition>
        </div>
      </component>
      <div v-if="slots.suffix" :class="ns.e('suffix')">
        <slot name="suffix" v-bind="scope" />
      </div>
      <div v-if="slots.actions" :class="ns.e('actions')" @click.stop>
        <slot name="actions" v-bind="scope" />
      </div>
      <div
        v-if="
          (showNavigation || showIndicator || slots.navigation) &&
          notices.length > 1
        "
        :class="ns.e('navigation')"
        @click.stop
      >
        <slot name="navigation" v-bind="scope">
          <button
            v-if="showNavigation"
            type="button"
            :class="ns.e('control')"
            :disabled="!canPrev"
            :aria-label="t('vs.noticeBar.previous')"
            @click="prev"
          >
            <SIcon name="cb:chevron-left" :size="16" />
          </button>
          <span v-if="showIndicator" :class="ns.e('indicator')" aria-live="off"
            >{{ index + 1 }} / {{ notices.length }}</span
          >
          <button
            v-if="showNavigation"
            type="button"
            :class="ns.e('control')"
            :disabled="!canNext"
            :aria-label="t('vs.noticeBar.next')"
            @click="next"
          >
            <SIcon name="cb:chevron-right" :size="16" />
          </button>
        </slot>
      </div>
      <button
        v-if="closable"
        type="button"
        :class="[ns.e('control'), ns.e('close')]"
        :aria-label="t('vs.noticeBar.close')"
        @click.stop="close"
      >
        <slot name="close-icon" v-bind="scope"
          ><IconClose :size="18" hover="less"
        /></slot>
      </button>
    </div>
  </Transition>
</template>
