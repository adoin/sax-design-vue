<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { layoutSectionProps, normalizeLayoutSize } from './layout'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SLayoutFooter' })

const props = defineProps(layoutSectionProps)
defineSlots<{ default?(): unknown }>()

const ns = useNamespace('layout-footer')

const style = computed<CSSProperties>(() => ({
  height:
    props.size === undefined ? undefined : normalizeLayoutSize(props.size),
  padding:
    props.padding === undefined
      ? undefined
      : normalizeLayoutSize(props.padding),
}))
</script>

<template>
  <footer :class="ns.b()" :style="style"><slot /></footer>
</template>
