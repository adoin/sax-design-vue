<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import LogoLoading from './logo-loading.vue'

defineOptions({
  name: 'IconLoading',
  inheritAttrs: false,
})

const ns = useNamespace('icon-loading')
</script>

<template>
  <LogoLoading v-bind="$attrs" :class="ns.b()" />
</template>
