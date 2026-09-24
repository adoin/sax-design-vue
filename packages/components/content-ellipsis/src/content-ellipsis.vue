<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
} from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { contentEllipsisEmits, contentEllipsisProps } from './content-ellipsis'

defineOptions({ name: 'SContentEllipsis' })

const props = defineProps(contentEllipsisProps)
const expanded = defineModel<boolean>('expanded', { default: false })
const emit = defineEmits(contentEllipsisEmits)
const ns = useNamespace('content-ellipsis')
const { t } = useLocale()
const viewportRef = useTemplateRef<HTMLElement>('viewport')
const contentRef = useTemplateRef<HTMLElement>('content')
const limitRef = useTemplateRef<HTMLElement>('limit')
const contentId = `s-content-ellipsis-${useId()}`

const ready = shallowRef(false)
const hasOverflow = shallowRef(false)
const contentHeight = shallowRef(0)
const limitHeight = shallowRef(0)
const animationSettled = shallowRef(true)

const collapsedHeightCss = computed(() =>
  typeof props.collapsedHeight === 'number'
    ? `${Math.max(0, props.collapsedHeight)}px`
    : props.collapsedHeight,
)
const label = computed(() =>
  expanded.value
    ? props.collapseText || t('vs.contentEllipsis.collapse')
    : props.expandText || t('vs.contentEllipsis.expand'),
)
const viewportStyle = computed(() => {
  if (!ready.value) {
    return {
      maxHeight: expanded.value ? 'none' : collapsedHeightCss.value,
      overflow: expanded.value ? 'visible' : 'hidden',
    }
  }
  if (!hasOverflow.value) {
    return { height: 'auto', maxHeight: 'none', overflow: 'visible' }
  }
  return {
    height: `${expanded.value ? contentHeight.value : limitHeight.value}px`,
    maxHeight: 'none',
    overflow: expanded.value && animationSettled.value ? 'visible' : 'hidden',
  }
})

let resizeObserver: ResizeObserver | undefined
const measure = () => {
  const content = contentRef.value
  const limit = limitRef.value
  if (!content || !limit) return
  const nextContentHeight = Math.ceil(content.getBoundingClientRect().height)
  const nextLimitHeight = limit.getBoundingClientRect().height
  if (
    ready.value &&
    expanded.value &&
    nextContentHeight !== contentHeight.value
  ) {
    animationSettled.value = false
  }
  contentHeight.value = nextContentHeight
  limitHeight.value = nextLimitHeight
  hasOverflow.value = nextContentHeight > nextLimitHeight + 1
  ready.value = true
}

onMounted(async () => {
  await nextTick()
  measure()
  if (typeof ResizeObserver === 'undefined') {
    window.addEventListener('resize', measure)
    return
  }
  resizeObserver = new ResizeObserver(measure)
  if (contentRef.value) resizeObserver.observe(contentRef.value)
  if (limitRef.value) resizeObserver.observe(limitRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (typeof window !== 'undefined')
    window.removeEventListener('resize', measure)
})

watch(expanded, async () => {
  if (!hasOverflow.value) return
  animationSettled.value = false
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  ) {
    await nextTick()
    animationSettled.value = true
  }
})

const setExpanded = (value: boolean) => {
  if (expanded.value === value) return
  expanded.value = value
  emit('change', value)
}

const onContentFocus = (event: FocusEvent) => {
  if (
    !hasOverflow.value ||
    expanded.value ||
    !(event.target instanceof Element)
  )
    return
  const viewport = viewportRef.value?.getBoundingClientRect()
  const target = event.target.getBoundingClientRect()
  if (viewport && target.bottom > viewport.bottom + 1) setExpanded(true)
}

const onHeightTransitionEnd = (event: TransitionEvent) => {
  if (event.target === viewportRef.value && event.propertyName === 'height') {
    animationSettled.value = true
  }
}
</script>

<template>
  <div :class="[ns.b(), ns.is('expanded', expanded)]">
    <div
      :id="contentId"
      ref="viewport"
      :class="[
        ns.e('viewport'),
        't-resize',
        ns.is('clipped', hasOverflow && !expanded && fade),
      ]"
      :style="viewportStyle"
      @transitionend="onHeightTransitionEnd"
      @focusin="onContentFocus"
    >
      <div ref="content" :class="ns.e('content')">
        <slot />
      </div>
    </div>
    <div
      ref="limit"
      :class="ns.e('limit')"
      :style="{ height: collapsedHeightCss }"
      aria-hidden="true"
    />
    <div v-if="hasOverflow" :class="ns.e('actions')">
      <button
        :class="ns.e('toggle')"
        type="button"
        :aria-controls="contentId"
        :aria-expanded="expanded"
        @click="setExpanded(!expanded)"
      >
        <span>{{ label }}</span>
        <SIcon name="cb:chevron-down" size="14" :class="ns.e('chevron')" />
      </button>
    </div>
  </div>
</template>
