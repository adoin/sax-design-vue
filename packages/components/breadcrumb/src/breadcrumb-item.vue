<template>
  <li
    :class="[
      ns.e('item'),
      ns.is('active', active),
      ns.is('disabled', disabled),
    ]"
    :aria-current="active ? 'page' : undefined"
  >
    <a v-if="!active && to" :href="to" :class="ns.e('link')">
      <slot />
    </a>
    <span v-else :class="ns.e('text')">
      <slot />
    </span>
    <span v-if="!active && !hideSeparator" :class="ns.e('separator')">
      <slot name="separator">{{ separator }}</slot>
    </span>
  </li>
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { breadcrumbItemProps } from './breadcrumb-item'

defineOptions({
  name: 'VsBreadcrumbItem',
})

defineProps(breadcrumbItemProps)

const ns = useNamespace('breadcrumb')
</script>
