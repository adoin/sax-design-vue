<template>
  <div
    :class="[
      ns.b(),
      ns.is('indeterminate', indeterminate),
      isVsColor(props.color) ? ns.m(props.color) : '',
    ]"
    :style="containerStyle"
  >
    <div :class="ns.e('foreground')" :style="foregroundStyle" />
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
import { getVsColor, isVsColor } from '@vuesax-alpha/utils'
import { progressProps } from './progress'

defineOptions({
  name: 'VsProgress',
})

const props = defineProps(progressProps)

const ns = useNamespace('progress')

const percentx = ref(0)

const containerStyle = computed(() => ({
  height: `${props.height}px`,
  ...(isVsColor(props.color)
    ? {}
    : ns.cssVar({ color: getVsColor(props.color) })),
}))

const foregroundStyle = computed(() => ({
  width: `${percentx.value}%`,
}))

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
