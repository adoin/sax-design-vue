<template>
  <div
    v-bind="$attrs"
    :class="[
      ns.b(),
      ns.m(`hover-${props.hover}`),
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
import { resolveVisualEnumProps } from '@vuesax-alpha/utils'
import { useNamespace } from '@vuesax-alpha/hooks'
import { imagesProps } from './images'

defineOptions({
  name: 'SImages',
  inheritAttrs: false,
})

const rawProps = defineProps(imagesProps)
const props = resolveVisualEnumProps('images', rawProps)

const ns = useNamespace('images')
</script>
