<script setup lang="ts">
import { ref } from 'vue'
import type { StreamingTextInstance } from 'sax-design-vue'
const viewer = ref<StreamingTextInstance>()
const text = ref(
  '为什么终端里会跑过一辆火车\n\n把 ls 误打成 sl，终端就会出现一辆缓缓驶过的蒸汽火车。这个小程序把常见的输入错误变成了一个有趣的提醒。\n\n安装后可以尝试 -l 小型火车、-F 飞行模式，或 -a 乘客求救动画。下面的命令只作为文本演示，不会自动执行。\n\nbrew install sl && sl -Fal\n\n火车驶过后会自行结束。阅读回答时，可以暂停播放、继续追加内容，或重新观看正文和命令逐步出现的过程。',
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
