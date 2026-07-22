<template>
  <div :class="ns.b()">
    <span :class="ns.e('content')" :style="contentStyle"
      ><slot>{{ content }}</slot></span
    >
    <button
      v-if="expandable"
      :class="ns.e('toggle')"
      type="button"
      @click="toggle"
    >
      {{ expanded ? collapseText : expandText }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { textEllipsisEmits, textEllipsisProps } from './text-ellipsis'

defineOptions({ name: 'STextEllipsis' })

const props = defineProps(textEllipsisProps)
const emit = defineEmits(textEllipsisEmits)
const ns = useNamespace('text-ellipsis')
const contentStyle = computed(() =>
  props.expanded ? {} : { WebkitLineClamp: props.lineClamp },
)
const toggle = () => {
  const value = !props.expanded
  emit('update:expanded', value)
  emit('change', value)
}
</script>
