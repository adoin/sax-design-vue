<template>
  <section :class="[ns.b(), ns.m(direction)]"><slot /></section>
</template>
<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { layoutContainerProps } from './layout'
defineOptions({ name: 'SLayoutContainer' })
defineProps(layoutContainerProps)
const ns = useNamespace('layout-container')
</script>
