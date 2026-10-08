<script setup lang="ts">
import { useNamespace } from '@vuesax-alpha/hooks'
import PlaceholderText from '@vuesax-alpha/components/base/src/placeholder-text.vue'

defineProps<{ text: string; dissolved: boolean }>()
const ns = useNamespace('input')
</script>

<template>
  <PlaceholderText
    :class="ns.e('placeholder-text')"
    :text="text"
    :dissolved="dissolved"
  />
</template>
