<template>
  <a
    :class="classes"
    :href="disabled ? undefined : href"
    :target="target"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="handleClick"
  >
    <slot />
  </a>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { linkEmits, linkProps } from './link'

defineOptions({ name: 'SLink' })

const props = defineProps(linkProps)
const emit = defineEmits(linkEmits)
const ns = useNamespace('link')

const classes = computed(() => [
  ns.b(),
  ns.m(props.status || props.type),
  ns.is('underline', props.underline),
  ns.is('disabled', props.disabled),
])

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>
