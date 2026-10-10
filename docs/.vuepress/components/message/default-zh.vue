<script setup lang="ts">
import { ref } from 'vue'
const showTime = ref(false)
const feedback = ref<'like' | 'dislike' | null>(null)
const content = ref('回答已准备好。可以展开时间或提供反馈。')
</script>

<template>
  <div class="agent-demo">
    <s-message
      v-model:show-time="showTime"
      v-model:feedback="feedback"
      :content="content"
      author="研究助手"
      sent-at="今天 09:30"
      datetime="2026-10-10T09:30:00+08:00"
      @regenerate="content = '修订后的回答已准备好。'"
    />
  </div>
</template>

<style scoped>
.agent-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  min-width: 0;
}
.agent-demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
