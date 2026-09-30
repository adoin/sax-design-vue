<script setup lang="ts">
import { useId } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import SvgDissolveFilter from '@vuesax-alpha/components/base/src/svg-dissolve-filter.vue'

defineProps<{ text: string; dissolved: boolean }>()
const ns = useNamespace('input')
// Vue's native ID is stable during SSR/hydration and unique within the app.
const filterId = `sax-placeholder-dissolve-${useId()}`
const filterStyle = { filter: `url("#${filterId}")` }
</script>

<template>
  <span :class="ns.e('placeholder-text')">
    <SvgDissolveFilter
      :class="ns.e('placeholder-filter')"
      :filter-id="filterId"
      :dissolved="dissolved"
    />
    <span :class="ns.e('placeholder-dissolve')" :style="filterStyle">
      <span :class="ns.e('placeholder-content')">{{ text }}</span>
    </span>
  </span>
</template>
