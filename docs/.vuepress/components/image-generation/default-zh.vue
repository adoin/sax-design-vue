<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { AgentStatus } from 'sax-design-vue'
const status = ref<AgentStatus>('pending')
const progress = ref(0)
const action = ref('')
const src = '/sax-logo-mark.svg'
let timer: ReturnType<typeof setInterval> | undefined
function cancel() {
  clearInterval(timer)
  status.value = 'cancelled'
}
function fail() {
  clearInterval(timer)
  status.value = 'error'
}
function generate() {
  clearInterval(timer)
  progress.value = 0
  status.value = 'running'
  timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(timer)
      status.value = 'complete'
    }
  }, 400)
}
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="agent-demo">
    <s-image-generation
      :status="status"
      :progress="progress"
      :src="src"
      alt="Sax 标志预览"
      @cancel="cancel"
      @retry="generate"
      @download="action = '已请求下载'"
    />
    <div class="agent-demo-actions">
      <s-button :disabled="status === 'running'" @click="generate"
        >生成预览</s-button
      ><s-button type="flat" :disabled="status !== 'running'" @click="fail"
        >模拟失败</s-button
      ><s-tag v-if="action">{{ action }}</s-tag>
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
