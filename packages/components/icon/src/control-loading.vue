<script setup lang="ts">
import { useNamespace } from '@vuesax-alpha/hooks'
import LogoLoading from './logo-loading.vue'
defineOptions({ name: 'IconControlLoading' })
const ns = useNamespace('control-loading')
</script>
<template>
  <span :class="ns.b()" aria-hidden="true"><LogoLoading :size="20" /></span>
</template>
