<template>
  <div
    :class="[
      ns.b(),
      ns.m(`hover-${hover}`),
      ns.is('alternating', alternating),
      ns.is('not-border-radius', notBorderRadius),
      ns.is('not-margin', notMargin),
    ]"
  >
    <ul :class="[ns.e('ul')]">
      <slot />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { imagesProps } from './images'

defineOptions({
  name: 'SImages',
  inheritAttrs: false,
})

defineProps(imagesProps)

const ns = useNamespace('images')
</script>
