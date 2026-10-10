<script setup lang="ts">
import { ref } from 'vue'
import type { StreamingTextInstance } from 'sax-design-vue'
const viewer = ref<StreamingTextInstance>()
const text = ref(
  'Why a typo runs a train\n\nType sl instead of ls and a steam locomotive travels across your terminal. This small program turns a common typing mistake into a playful reminder.\n\nTry -l for a small train, -F for flying mode, or -a for calling passengers. The command below is displayed as text and is never executed automatically.\n\nbrew install sl && sl -Fal\n\nThe train exits on its own. Pause the reply, append more information, or replay the gradual reveal of the prose and command.',
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
    >
      <template #default="{ text: revealed, paragraphs, wordClass }">
        <template v-for="(paragraph, index) in paragraphs" :key="index">
          <h3 v-if="index === 0">
            <span
              v-for="chunk in paragraph"
              :key="chunk.key"
              :class="wordClass"
              >{{ chunk.text }}</span
            >
          </h3>
          <s-code-block
            v-else-if="index === 3"
            class="stream-demo-terminal"
            filename="Terminal"
            language="bash"
            :code="revealed.split('\n\n')[3] || ''"
            :line-numbers="false"
          >
            <template #line
              ><span
                v-for="chunk in paragraph"
                :key="chunk.key"
                :class="wordClass"
                >{{ chunk.text }}</span
              ></template
            >
          </s-code-block>
          <p v-else>
            <span
              v-for="chunk in paragraph"
              :key="chunk.key"
              :class="wordClass"
              >{{ chunk.text }}</span
            >
          </p>
        </template>
      </template>
    </s-streaming-text>
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
.agent-demo :deep(.s-streaming-text > h3),
.agent-demo :deep(.s-streaming-text > p) {
  margin: 0 0 14px;
}
.stream-demo-terminal {
  margin: 0 0 14px;
  animation: stream-terminal-reveal var(--sax-transition-duration) ease-out both;
}
@keyframes stream-terminal-reveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .stream-demo-terminal {
    animation: none;
  }
}
</style>
