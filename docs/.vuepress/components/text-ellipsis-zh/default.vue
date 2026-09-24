<script lang="ts" setup>
import { shallowRef } from 'vue'

const expanded = shallowRef(false)
const content =
  'Sax Design Vue 通过统一的排版、色彩与交互规则，让复杂的业务页面保持清晰和一致。无论是信息密集的数据概览，还是需要专注阅读的详情视图，团队都可以沿用同一套视觉语言，让读者快速理解重点，同时保留完整的背景信息。'
</script>

<template>
  <s-text-ellipsis
    v-model:expanded="expanded"
    :line-clamp="2"
    expandable
    :content="content"
  />
</template>
