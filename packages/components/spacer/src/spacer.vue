<template>
  <div :class="ns.b()">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'

defineOptions({
  name: 'VsSpacer',
})

const ns = useNamespace('spacer')
</script>
