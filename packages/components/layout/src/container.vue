<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { layoutContainerProps, normalizeLayoutSize } from './layout'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SLayoutContainer' })

const props = defineProps(layoutContainerProps)
defineSlots<{ default?(): unknown }>()

const ns = useNamespace('layout-container')

const style = computed(
  () =>
    ({
      '--s-layout-container-gap': normalizeLayoutSize(props.gap),
    }) as CSSProperties,
)
</script>

<template>
  <section
    :class="[
      ns.b(),
      ns.m(props.direction),
      ns.is('wrap', props.wrap),
      ns.is(`align-${props.align}`),
      ns.is(`justify-${props.justify}`),
    ]"
    :style="style"
  >
    <slot />
  </section>
</template>
