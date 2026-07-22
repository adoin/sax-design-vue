<template>
  <aside :class="ns.b()" :style="style"><slot /></aside>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { addUnit } from '@vuesax-alpha/utils'
import { useNamespace } from '@vuesax-alpha/hooks'
import { layoutSectionProps } from './layout'
defineOptions({ name: 'SLayoutAside' })
const props = defineProps(layoutSectionProps)
const ns = useNamespace('layout-aside')
const style = computed(() => ({
  width: props.size ? addUnit(props.size) : undefined,
}))
</script>
