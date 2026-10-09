<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import STooltip from '@vuesax-alpha/components/tooltip'
import {
  addUnit,
  getCssColor,
  isVsColor,
  normalizeVsColor,
} from '@vuesax-alpha/utils'
import { progressProps, progressTextures } from './progress'
import ProgressTexture from './progress-texture.vue'
import { useProgressMotion } from './use-progress-motion'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SProgress',
  inheritAttrs: false,
})

const props = defineProps(progressProps)

const ns = useNamespace('progress')
const attrs = useAttrs()
const root = useTemplateRef<HTMLElement>('root')
const clampPercent = (value: number) =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0
const normalizedPercent = computed(() => clampPercent(props.percent))
const texture = computed(() =>
  progressTextures.includes(props.texture) ? props.texture : 'default',
)
const hasTexture = computed(() => texture.value !== 'default')
const measuredHeight = shallowRef(5)
watch(
  [root, hasTexture, () => props.height],
  ([element, textured], _old, cleanup) => {
    if (!element || !textured) return
    const measure = () => {
      const value = element.clientHeight || Number(props.height)
      if (Number.isFinite(value) && value > 0) measuredHeight.value = value
    }
    measure()
    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure)
      observer.observe(element)
    }
    cleanup(() => observer?.disconnect())
  },
  { flush: 'post' },
)
const textureDuration = computed(() =>
  Number.isFinite(props.textureDuration)
    ? Math.max(0, props.textureDuration)
    : 2000,
)
const textureOpacity = computed(() =>
  Number.isFinite(props.textureOpacity)
    ? Math.min(1, Math.max(0, props.textureOpacity))
    : 0.6,
)
const motion = useProgressMotion(
  root,
  () =>
    props.indeterminate ||
    (hasTexture.value &&
      props.textureAnimated &&
      textureDuration.value > 0 &&
      textureOpacity.value > 0 &&
      normalizedPercent.value > 0 &&
      normalizedPercent.value < 100),
)

const percentx = shallowRef(0)
let entranceTimer: ReturnType<typeof setTimeout> | undefined

const themeColor = computed(() => normalizeVsColor(props.color))
const isThemeColor = computed(() => isVsColor(themeColor.value))
const cssColor = computed(() =>
  props.color === 'info' ? 'var(--sax-css-info)' : getCssColor(props.color),
)

const containerStyle = computed((): CSSProperties => {
  const style: CSSProperties = { height: addUnit(props.height) }
  if (!isThemeColor.value) {
    const c = cssColor.value
    if (c) {
      style.background = `color-mix(in srgb, ${c} 10%, transparent)`
    }
  }
  return style
})

const foregroundStyle = computed((): CSSProperties => {
  const style: CSSProperties = {
    width: `${props.indeterminate ? 0 : percentx.value}%`,
  }
  if (!isThemeColor.value) {
    const c = cssColor.value
    if (c) {
      style.background = c
    }
  }
  return style
})

const indeterminateStyle = computed((): CSSProperties => {
  if (isThemeColor.value) {
    return {}
  }

  const c = cssColor.value
  if (!c) {
    return {}
  }

  return {
    background: c,
  }
})

watch(
  () => props.percent,
  (val) => {
    if (entranceTimer) {
      clearTimeout(entranceTimer)
      entranceTimer = undefined
    }
    percentx.value = clampPercent(val)
  },
)

onMounted(() => {
  percentx.value = 0
  if (
    root.value?.ownerDocument.defaultView?.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches
  ) {
    percentx.value = normalizedPercent.value
    return
  }
  entranceTimer = setTimeout(() => {
    entranceTimer = undefined
    percentx.value = normalizedPercent.value
  }, 600)
})

onBeforeUnmount(() => {
  if (entranceTimer) {
    clearTimeout(entranceTimer)
    entranceTimer = undefined
  }
})
</script>

<template>
  <s-tooltip
    :disabled="!$slots.default"
    placement="top"
    :trigger-style="{ width: '100%', display: 'block' }"
  >
    <div
      ref="root"
      v-bind="attrs"
      :class="[
        ns.b(),
        ns.is('indeterminate', indeterminate),
        ns.is('motion-paused', !motion.playing.value),
        ns.is('reduced-motion', motion.reducedMotion.value),
        isThemeColor ? ns.m(themeColor) : '',
      ]"
      :style="containerStyle"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="indeterminate ? undefined : normalizedPercent"
      :aria-busy="indeterminate || undefined"
    >
      <div :class="ns.e('foreground')" :style="foregroundStyle">
        <ProgressTexture
          v-if="hasTexture && !indeterminate && percentx > 0"
          :texture="texture"
          :animated="
            textureAnimated && textureDuration > 0 && textureOpacity > 0
          "
          :duration="textureDuration"
          :opacity="textureOpacity"
          :height="measuredHeight"
          :playing="motion.playing.value"
        />
      </div>
      <div
        v-if="indeterminate"
        :class="ns.e('indeterminate')"
        :style="indeterminateStyle"
      >
        <ProgressTexture
          v-if="hasTexture"
          :texture="texture"
          :animated="
            textureAnimated && textureDuration > 0 && textureOpacity > 0
          "
          :duration="textureDuration"
          :opacity="textureOpacity"
          :height="measuredHeight"
          :playing="motion.playing.value"
        />
      </div>
    </div>
    <template v-if="$slots.default" #content>
      <slot />
    </template>
  </s-tooltip>
</template>
