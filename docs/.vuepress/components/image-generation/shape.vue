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
  }, 180)
}
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>Rounded</s-tag>
      <s-image-generation
        shape="rounded"
        :status="status"
        :progress="progress"
        :src="src"
        alt="Sax logo preview"
        @cancel="cancel"
        @retry="generate"
        @download="action = 'Download requested'"
      />
      <div class="agent-demo-actions">
        <s-button :disabled="status === 'running'" @click="generate"
          >Generate preview</s-button
        ><s-button
          type="flat"
          :disabled="status !== 'running'"
          @click="status = 'error'"
          >Simulate failure</s-button
        ><s-tag v-if="action">{{ action }}</s-tag>
      </div>
    </div>
    <div class="agent-demo">
      <s-tag>Square</s-tag>
      <s-image-generation
        shape="square"
        :status="status"
        :progress="progress"
        :src="src"
        alt="Sax logo preview"
        @cancel="cancel"
        @retry="generate"
        @download="action = 'Download requested'"
      />
      <div class="agent-demo-actions">
        <s-button :disabled="status === 'running'" @click="generate"
          >Generate preview</s-button
        ><s-button
          type="flat"
          :disabled="status !== 'running'"
          @click="status = 'error'"
          >Simulate failure</s-button
        ><s-tag v-if="action">{{ action }}</s-tag>
      </div>
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
