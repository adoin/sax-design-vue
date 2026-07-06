<template>
  <div :class="ns.b()">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { listProps } from './list'

defineOptions({
  name: 'VsList',
})

defineProps(listProps)

const ns = useNamespace('list')
</script>
