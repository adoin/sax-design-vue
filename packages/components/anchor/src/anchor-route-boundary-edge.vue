<template>
  <div
    :class="[
      ns.be('route-boundary', 'shell'),
      ns.is('visible', visible),
      ns.is('previous', direction === 'previous'),
    ]"
  >
    <div
      :class="[
        ns.b('route-boundary'),
        ns.is('visible', visible),
        ns.is('navigating', navigating),
        ns.is('disabled', item.disabled),
        ns.is('previous', direction === 'previous'),
      ]"
      :aria-hidden="visible ? undefined : 'true'"
    >
      <a
        :class="ns.be('route-boundary', 'link')"
        :href="item.disabled ? undefined : item.href"
        :aria-disabled="item.disabled || undefined"
        :aria-label="accessibleLabel"
        :tabindex="item.disabled || !visible ? -1 : undefined"
        @click="emit('activate', $event)"
      >
        <span
          :class="ns.be('route-boundary', 'progress')"
          role="progressbar"
          :aria-label="t('vs.anchor.scrollProgress')"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.round(progress * 100)"
        >
          <svg
            :class="ns.be('route-boundary', 'progress-ring')"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <circle
              :class="ns.be('route-boundary', 'progress-track')"
              cx="12"
              cy="12"
              r="9"
              pathLength="1"
            />
            <circle
              :class="ns.be('route-boundary', 'progress-value')"
              cx="12"
              cy="12"
              r="9"
              pathLength="1"
              :style="{ strokeDashoffset: String(1 - progress) }"
              @transitionend="handleProgressTransitionEnd"
            />
          </svg>
          <span :class="ns.be('route-boundary', 'icon')" aria-hidden="true">
            <svg width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="m12 16l-6-6l1.4-1.4l4.6 4.575L16.6 8.6L18 10z"
              />
            </svg>
          </span>
        </span>

        <slot>
          <strong :class="ns.be('route-boundary', 'title')">
            {{ item.title }}
          </strong>
        </slot>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import type {
  AnchorRouteBoundaryDirection,
  AnchorRouteBoundaryItem,
} from './anchor-route-boundary'

defineOptions({ name: 'SAnchorRouteBoundaryEdge' })

const props = defineProps<{
  item: AnchorRouteBoundaryItem
  direction: AnchorRouteBoundaryDirection
  visible: boolean
  navigating: boolean
  progress: number
}>()
const emit = defineEmits<{
  activate: [event: MouseEvent]
  progressComplete: []
}>()
const ns = useNamespace('anchor')
const { t } = useLocale()
const hint = computed(() => {
  if (props.navigating) return t('vs.anchor.routeLoading')
  if (!props.visible)
    return t(
      props.direction === 'previous'
        ? 'vs.anchor.reachTop'
        : 'vs.anchor.reachBottom',
    )
  return t(
    props.direction === 'previous'
      ? 'vs.anchor.continueScrollUp'
      : 'vs.anchor.continueScroll',
  )
})
const accessibleLabel = computed(
  () =>
    `${t(
      props.direction === 'previous'
        ? 'vs.anchor.previousRoute'
        : 'vs.anchor.nextRoute',
    )}: ${props.item.title}. ${hint.value}`,
)
const handleProgressTransitionEnd = (event: TransitionEvent) => {
  if (event.propertyName === 'stroke-dashoffset' && props.progress >= 1)
    emit('progressComplete')
}
</script>
