<template>
  <i
    :class="[
      ns.b(),
      ns.is('indeterminate', indeterminate),
      ns.is('active', active),
    ]"
  >
    <div v-if="indeterminate" :class="ns.e('line')" />

    <svg v-else :class="ns.e('check')" viewBox="0 0 24 24">
      <path
        fill="none"
        d="M 4.7071 12.2929 l 5 5 c 0.3905 0.3905 1.0237 0.3905 1.4142 0 l 11 -11"
      />
    </svg>
  </i>
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { checkProps } from './check'

defineOptions({
  name: 'IconCheck',
})

defineProps(checkProps)

const ns = useNamespace('icon-check')
</script>
