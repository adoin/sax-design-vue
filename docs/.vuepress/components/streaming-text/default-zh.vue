<script setup lang="ts">
import { ref } from 'vue'
import type { StreamingTextInstance } from 'sax-design-vue'
const viewer = ref<StreamingTextInstance>()
const text = ref(
  '分阶段到达的回答\n\n流式回答让内容逐步呈现，并安全显示 <标签> 和 emoji 👨‍👩‍👧。\n\n新的观察会追加到已有段落之后，过程中可以暂停、继续或补充更多证据。',
)
const paused = ref(false)
const streaming = ref(false)
const finished = ref(false)
function append() {
  finished.value = false
  streaming.value = true
  text.value += '新增内容可以继续追加，不必重新播放已有回答。'
}
function replay() {
  finished.value = false
  viewer.value?.replay()
}
function onFinish() {
  finished.value = true
  streaming.value = false
}
</script>

<template>
  <div class="agent-demo">
    <s-streaming-text
      ref="viewer"
      :text="text"
      :paused="paused"
      :streaming="streaming"
      @finish="onFinish"
    >
      <template #default="{ text: revealed }">
        <h3 v-if="revealed.split('\n\n')[0]">
          {{ revealed.split('\n\n')[0] }}
        </h3>
        <p
          v-for="(paragraph, index) in revealed.split('\n\n').slice(1)"
          :key="index"
        >
          {{ paragraph }}
        </p>
      </template>
    </s-streaming-text>
    <div class="agent-demo-actions">
      <s-button @click="paused = !paused">{{
        paused ? '继续' : '暂停'
      }}</s-button
      ><s-button type="flat" @click="append">追加内容</s-button
      ><s-button type="flat" @click="replay">重播</s-button
      ><s-button type="flat" @click="viewer?.finish()">显示全部</s-button
      ><s-tag v-if="finished">已完成</s-tag>
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
</style>
