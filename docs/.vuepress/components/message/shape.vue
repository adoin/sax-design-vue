<script setup lang="ts">
import { ref } from 'vue'
const showTime = ref(false)
const feedback = ref<'like' | 'dislike' | null>(null)
const content = ref(
  'Your answer is ready. Open the timestamp or leave feedback.',
)
</script>

<template>
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>Rounded</s-tag>
      <s-message
        v-model:show-time="showTime"
        v-model:feedback="feedback"
        shape="rounded"
        :content="content"
        author="Research assistant"
        sent-at="Today, 09:30"
        datetime="2026-10-10T09:30:00+08:00"
        @regenerate="content = 'A revised answer is ready.'"
      />
    </div>
    <div class="agent-demo">
      <s-tag>Square</s-tag>
      <s-message
        v-model:show-time="showTime"
        v-model:feedback="feedback"
        shape="square"
        :content="content"
        author="Research assistant"
        sent-at="Today, 09:30"
        datetime="2026-10-10T09:30:00+08:00"
        @regenerate="content = 'A revised answer is ready.'"
      />
    </div>
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
.agent-demo-shapes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 24px;
  width: 100%;
}
</style>
