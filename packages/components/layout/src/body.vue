<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { layoutBodyProps, normalizeLayoutSize } from './layout'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SLayoutBody' })

const props = defineProps(layoutBodyProps)
defineSlots<{ default?(): unknown }>()

const ns = useNamespace('layout-body')

const style = computed<CSSProperties>(() => ({
  padding:
    props.padding === undefined
      ? undefined
      : normalizeLayoutSize(props.padding),
}))
</script>

<template>
  <main :class="ns.b()" :style="style"><slot /></main>
</template>
