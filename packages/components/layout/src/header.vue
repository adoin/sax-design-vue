<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { layoutHeaderProps, normalizeLayoutSize } from './layout'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SLayoutHeader' })

const props = defineProps(layoutHeaderProps)
defineSlots<{ default?(): unknown }>()

const ns = useNamespace('layout-header')

const style = computed(
  () =>
    ({
      height:
        props.size === undefined ? undefined : normalizeLayoutSize(props.size),
      padding:
        props.padding === undefined
          ? undefined
          : normalizeLayoutSize(props.padding),
      '--s-layout-header-sticky-offset': normalizeLayoutSize(
        props.stickyOffset,
      ),
      '--s-layout-header-z-index': props.zIndex,
    }) as CSSProperties,
)
</script>

<template>
  <header :class="[ns.b(), ns.is('sticky', props.sticky)]" :style="style">
    <slot />
  </header>
</template>
