<script setup lang="ts">
import { ref } from 'vue'
const showTime = ref(false)
const userTime = ref(false)
const feedback = ref<'like' | 'dislike' | null>(null)
const content = ref('回答已准备好。可以展开时间或提供反馈。')
</script>

<template>
  <div class="agent-demo">
    <s-message
      v-model:show-time="userTime"
      role="user"
      author="用户"
      content="可以帮我审阅这份文档吗？"
      sent-at="今天 09:29"
    >
      <template #avatar
        ><s-avatar :size="30" shape="circle"
          ><img src="/avatars/avatar-5.png" alt="用户头像" /></s-avatar
      ></template>
    </s-message>

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
