<script setup lang="ts">
import { useId, useNamespace, useSize } from '@vuesax-alpha/hooks'
import { resultProps } from './result'
import ResultIllustration from './result-illustration.vue'
defineOptions({ name: 'SResult' })
defineProps(resultProps)
const ns = useNamespace('result')
const size = useSize()
const titleId = `sax-result-title-${useId().value}`
</script>

<template>
  <section
    :class="[ns.b(), ns.m(status), ns.m(size || 'default'), ns.is(layout)]"
    :aria-labelledby="title || $slots.title ? titleId : undefined"
  >
    <div
      :class="[ns.e('icon'), ns.is('custom', !!$slots.icon)]"
      aria-hidden="true"
    >
      <slot name="icon" :status="status"
        ><ResultIllustration
          :key="status"
          :status="status"
          :animated="animated"
      /></slot>
    </div>
    <div :class="ns.e('body')">
      <h3 v-if="title || $slots.title" :id="titleId" :class="ns.e('title')">
        <slot name="title" :status="status">{{ title }}</slot>
      </h3>
      <div
        v-if="description || content || $slots.default"
        :class="ns.e('description')"
      >
        <slot :status="status">{{ description || content }}</slot>
      </div>
      <div v-if="$slots.details" :class="ns.e('details')">
        <slot name="details" :status="status" />
      </div>
      <div v-if="$slots.extra" :class="ns.e('extra')">
        <slot name="extra" :status="status" />
      </div>
    </div>
  </section>
</template>
