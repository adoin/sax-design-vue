<template>
  <s-tooltip
    :disabled="!$slots.default"
    placement="top"
    :trigger-style="{ width: '100%', display: 'block' }"
  >
    <div
      :class="[
        ns.b(),
        ns.is('indeterminate', indeterminate),
        isThemeColor ? ns.m(themeColor) : '',
      ]"
      :style="containerStyle"
    >
      <div :class="ns.e('foreground')" :style="foregroundStyle" />
      <div
        v-if="indeterminate"
        :class="ns.e('indeterminate')"
        :style="indeterminateStyle"
      />
    </div>
    <template v-if="$slots.default" #content>
      <slot />
    </template>
  </s-tooltip>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import STooltip from '@vuesax-alpha/components/tooltip'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { progressProps } from './progress'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SProgress',
})

const props = defineProps(progressProps)

const ns = useNamespace('progress')

const percentx = ref(0)
let entranceTimer: ReturnType<typeof setTimeout> | undefined

const themeColor = computed(() => normalizeVsColor(props.color))
const isThemeColor = computed(() => isVsColor(themeColor.value))

const containerStyle = computed((): CSSProperties => {
  const style: CSSProperties = { height: `${props.height}px` }
  if (!isThemeColor.value) {
    const c = getVsColor(props.color)
    if (c) {
      if (c.startsWith('var(')) {
        style.background = `color-mix(in srgb, ${c} 10%, transparent)`
      } else {
        style.background = `rgba(${c}, 0.1)`
      }
    }
  }
  return style
})

const foregroundStyle = computed((): CSSProperties => {
  const style: CSSProperties = { width: `${percentx.value}%` }
  if (!isThemeColor.value) {
    const c = getVsColor(props.color)
    if (c) {
      style.background = c.startsWith('var(') ? c : `rgb(${c})`
    }
  }
  return style
})

const indeterminateStyle = computed((): CSSProperties => {
  if (isThemeColor.value) {
    return {}
  }

  const c = getVsColor(props.color)
  if (!c) {
    return {}
  }

  return {
    background: c.startsWith('var(') ? c : `rgb(${c})`,
  }
})

watch(
  () => props.percent,
  (val) => {
    if (entranceTimer) {
      clearTimeout(entranceTimer)
      entranceTimer = undefined
    }
    percentx.value = val
  }
)

onMounted(() => {
  percentx.value = 0
  entranceTimer = setTimeout(() => {
    entranceTimer = undefined
    percentx.value = props.percent
  }, 600)
})

onBeforeUnmount(() => {
  if (entranceTimer) {
    clearTimeout(entranceTimer)
    entranceTimer = undefined
  }
})
</script>
