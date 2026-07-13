<template>
  <div :class="headerKls" :style="headerStyle">
    <VsIcon
      v-if="icon"
      :icon="icon"
      :icon-pack="iconPack"
      :class="ns.e('header-icon')"
    />
    <div :class="ns.e('header-titles')">
      <div v-if="title" :class="ns.e('header-title')">{{ title }}</div>
      <slot v-else name="title" />
      <div v-if="subtitle" :class="ns.e('header-subtitle')">{{ subtitle }}</div>
      <slot v-else name="subtitle" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { listHeaderProps } from './list-header'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'VsListHeader',
})

const props = defineProps(listHeaderProps)

const ns = useNamespace('list')

const themeColor = computed(() => normalizeVsColor(props.color))

const headerKls = computed(() => [
  ns.e('header'),
  isVsColor(themeColor.value) && ns.m(themeColor.value),
  props.icon && ns.is('with-icon', true),
])

const headerStyle = computed((): CSSProperties => {
  if (isVsColor(themeColor.value)) return {}
  const color = getVsColor(props.color)
  return color
    ? { color: color.startsWith('var(') ? color : `rgb(${color})` }
    : {}
})
</script>
