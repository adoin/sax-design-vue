<template>
  <div :class="[ns.b('content'), `type-${type}`]">
    <div :class="ns.b()" v-bind="$attrs">
      <div v-if="$slots.img" :class="ns.e('img')">
        <slot name="img" />
        <div v-if="$slots.interactions" :class="ns.e('interactions')">
          <slot name="interactions" />
        </div>
      </div>

      <div v-if="$slots.text" :class="ns.e('text')">
        <div v-if="$slots.title" :class="ns.e('title')">
          <slot name="title" />
        </div>

        <slot name="text" />
      </div>

      <div v-if="$slots.buttons" :class="ns.e('button')">
        <slot name="buttons" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@vuesax-alpha/hooks'
import { cardProps } from './card'

defineOptions({
  inheritAttrs: false,
  name: 'VsCard',
})

defineProps(cardProps)

const ns = useNamespace('card')
</script>
