<template>
  <section :class="[ns.b(), ns.m(status)]">
    <div :class="ns.e('icon')" aria-hidden="true">
      <slot name="icon">{{ symbol }}</slot>
    </div>
    <h3 v-if="title || $slots.title" :class="ns.e('title')">
      <slot name="title">{{ title }}</slot>
    </h3>
    <p
      v-if="description || content || $slots.default"
      :class="ns.e('description')"
    >
      <slot>{{ description || content }}</slot>
    </p>
    <div v-if="$slots.extra" :class="ns.e('extra')"><slot name="extra" /></div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { resultProps } from './result'

defineOptions({ name: 'SResult' })

const props = defineProps(resultProps)
const ns = useNamespace('result')
const symbol = computed(
  () => ({ success: '✓', warning: '!', error: '×', info: 'i' })[props.status],
)
</script>
