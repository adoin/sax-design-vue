<script setup lang="ts">
import { ref } from 'vue'
import type { StreamingTextInstance } from 'sax-design-vue'
const viewer = ref<StreamingTextInstance>()
const text = ref(
  'A streaming response preserves your reading rhythm. Text is displayed safely, including <tags> and emoji 👨‍👩‍👧.',
)
const paused = ref(false)
const streaming = ref(false)
const finished = ref(false)
function append() {
  finished.value = false
  streaming.value = true
  text.value +=
    ' New evidence can be appended without replaying the earlier answer.'
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
    />
    <div class="agent-demo-actions">
      <s-button @click="paused = !paused">{{
        paused ? 'Resume' : 'Pause'
      }}</s-button
      ><s-button type="flat" @click="append">Append content</s-button
      ><s-button type="flat" @click="replay">Replay</s-button
      ><s-button type="flat" @click="viewer?.finish()">Show all</s-button
      ><s-tag v-if="finished">Complete</s-tag>
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
