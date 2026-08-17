<template>
  <div :class="[ns.b('content'), `type-${type}`]">
    <div :class="ns.b()" v-bind="$attrs">
      <div v-if="$slots.img" :class="ns.e('img')">
        <slot name="img" />
        <div v-if="$slots.interactions" :class="ns.e('interactions')">
          <slot name="interactions" />
        </div>
      </div>

      <div
        v-if="$slots.title || title || $slots.text || text"
        :class="ns.e('text')"
      >
        <div v-if="$slots.title || title" :class="ns.e('title')">
          <slot name="title">
            <h3 :class="ns.e('title-text')">{{ title }}</h3>
          </slot>
        </div>

        <slot name="text">
          <p v-if="text" :class="ns.e('description')">{{ text }}</p>
        </slot>
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
  name: 'SCard',
  inheritAttrs: false,
})

defineProps(cardProps)

const ns = useNamespace('card')
</script>
