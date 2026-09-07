<script setup lang="ts">
import { computed, toRef } from 'vue'

import { useDocLocaleUi } from '../composables/docLocale'
import { useInlineCodeCopy } from '../composables/useInlineCodeCopy'
import CodeCopied from './CodeCopied.vue'

const props = defineProps<{
  target?: HTMLElement
}>()

const { t } = useDocLocaleUi()
const { copied } = useInlineCodeCopy(toRef(props, 'target'), {
  copyLabel: computed(() => t.value.examples.copy),
  copiedLabel: computed(() => t.value.examples.copied),
})
</script>

<template>
  <CodeCopied :copied="copied" :text="t.examples.copied" />
</template>
