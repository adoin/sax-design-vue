<template>
  <div
    :class="[
      ns.b(),
      ns.is('indeterminate', indeterminate),
      isThemeColor ? ns.m(themeColor) : '',
    ]"
    :style="containerStyle"
  >
    <div :class="ns.e('foreground')" :style="foregroundStyle">
      <span v-if="$slots.default" :class="ns.e('label')">
        <slot />
      </span>
    </div>
    <div
      v-if="indeterminate"
      :class="ns.e('indeterminate')"
      :style="foregroundStyle"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { progressProps } from './progress'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SProgress',
})

const props = defineProps(progressProps)

const ns = useNamespace('progress')

const percentx = ref(0)

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

watch(
  () => props.percent,
  (val) => {
    percentx.value = val
  }
)

onMounted(() => {
  percentx.value = 0
  setTimeout(() => {
    percentx.value = props.percent
  }, 600)
})
</script>
