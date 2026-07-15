<template>
  <div :class="ns.b()" />
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'

defineOptions({
  name: 'SSpacer',
})

const ns = useNamespace('spacer')
</script>
