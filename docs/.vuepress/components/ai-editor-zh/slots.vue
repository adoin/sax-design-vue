<script setup lang="ts">
import { ref } from 'vue'
const text = ref('客服工单少了，用户反馈也不错，登录改版应该有帮助。')
const answer =
  '登录改版灰度期间，客服工单较上周减少 18%。团队将继续收集用户反馈，并结合全量发布后的数据评估改版效果。'
</script>

<template>
  <s-ai-editor v-model="text" title="管理层汇报摘要" :answer="answer">
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
