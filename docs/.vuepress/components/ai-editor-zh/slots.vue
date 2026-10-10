<script setup lang="ts">
import { ref } from 'vue'
const text = ref('聚焦的工具栏可以只提供当前文档需要的格式操作。')
const answer = '通过 toolbar 插槽，可以为文档提供更精简的操作。'
</script>

<template>
  <s-ai-editor v-model="text" title="自定义选区操作" :answer="answer">
    <template #toolbar="{ selection, format }">
      <s-button size="small" @mousedown.prevent @click="format('underline')"
        >下划线</s-button
      >
      <s-tag color="primary">{{ selection.text.length }} 个字符</s-tag>
    </template>
    <template #answer="{ text: reply }">
      <s-text color="primary">{{ reply }}</s-text>
    </template>
  </s-ai-editor>
</template>
