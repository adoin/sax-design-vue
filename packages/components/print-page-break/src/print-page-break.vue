<template><div :class="ns.b()" aria-hidden="true" /></template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'

defineOptions({ name: 'SPrintPageBreak' })
const ns = useNamespace('print-page-break')
</script>
