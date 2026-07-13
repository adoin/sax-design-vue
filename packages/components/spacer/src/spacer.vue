<template>
  <div :class="ns.b()" />
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'

defineOptions({
  name: 'VsSpacer',
})

const ns = useNamespace('spacer')
</script>
