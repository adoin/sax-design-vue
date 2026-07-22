<template>
  <component
    :is="tag"
    :class="classes"
    :style="style"
    :title="title || tooltipText"
  >
    <slot>{{ content }}</slot>
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { textProps } from './text'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SText' })

const props = defineProps(textProps)
const ns = useNamespace('text')

const classes = computed(() => [
  ns.b(),
  props.status || props.type ? ns.m(props.status || props.type) : undefined,
  ns.is('ellipsis', props.ellipsis),
  props.lineClamp && ns.is('clamp', true),
])
const style = computed<CSSProperties>(() =>
  props.lineClamp ? { WebkitLineClamp: props.lineClamp } : {},
)
const tooltipText = computed(() =>
  props.ellipsis || props.lineClamp ? `${props.content || ''}` : undefined,
)
</script>
