<template>
  <main :class="ns.b()"><slot /></main>
</template>
<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
defineOptions({ name: 'SLayoutBody' })
const ns = useNamespace('layout-body')
</script>
