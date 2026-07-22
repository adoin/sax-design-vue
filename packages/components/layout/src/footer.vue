<template>
  <footer :class="ns.b()" :style="style"><slot /></footer>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { addUnit } from '@vuesax-alpha/utils'
import { useNamespace } from '@vuesax-alpha/hooks'
import { layoutSectionProps } from './layout'
defineOptions({ name: 'SLayoutFooter' })
const props = defineProps(layoutSectionProps)
const ns = useNamespace('layout-footer')
const style = computed(() => ({
  height: props.size ? addUnit(props.size) : undefined,
}))
</script>
