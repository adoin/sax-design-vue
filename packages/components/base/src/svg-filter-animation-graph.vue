<script setup lang="ts">
import { h, shallowRef } from 'vue'
import { svgFilterAnimations } from '@vuesax-alpha/utils/svg-filter-animation'
import { useSvgFilterAnimation } from '@vuesax-alpha/hooks/use-svg-filter-animation'
import type { SvgFilterNode } from '@vuesax-alpha/utils'

const props = withDefaults(
  defineProps<{
    animation: string
    filterId: string
    progress: number
    initialProgress?: number
    animateOnMount?: boolean
    region?: string
    duration?: number
    reverseDuration?: number
  }>(),
  { region: 'text' },
)
const emit = defineEmits<{ settled: [progress: number] }>()
// A playback keeps one immutable module; remount to switch module declarations.
const module = svgFilterAnimations.get(props.animation)
const filter = shallowRef<SVGFilterElement | null>(null)
const initial = useSvgFilterAnimation(module, () => props.progress, filter, {
  initialProgress: props.initialProgress,
  animateOnMount: props.animateOnMount,
  duration: () => props.duration ?? module.duration ?? 480,
  reverseDuration: props.reverseDuration,
  onSettled: (value) => emit('settled', value),
})
const nodes = (
  definitions: readonly SvgFilterNode[],
  parent: number[] = [],
): ReturnType<typeof h>[] =>
  definitions.map((node, index) => {
    const path = [...parent, index]
    const attrs = { ...node.attrs }
    for (const binding of module.bindings)
      if (binding.path.join('.') === path.join('.'))
        attrs[binding.attribute] = initial[binding.channel]
    return h(
      node.tag,
      attrs,
      node.children ? nodes(node.children, path) : undefined,
    )
  })
const Graph = () =>
  h(
    'filter',
    {
      ...module.definition.attrs,
      ...module.regions?.[props.region],
      id: props.filterId,
      ref: filter,
    },
    nodes(module.definition.nodes),
  )
</script>

<template>
  <svg
    aria-hidden="true"
    focusable="false"
    width="0"
    height="0"
    style="position: absolute; pointer-events: none"
  >
    <defs><Graph /></defs>
  </svg>
</template>
