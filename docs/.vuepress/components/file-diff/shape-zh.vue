<script setup lang="ts">
import { ref } from 'vue'
import type { FileDiffLine } from 'sax-design-vue'
const expanded = ref(true)
const decision = ref('')
const lines: FileDiffLine[] = [
  {
    type: 'context',
    content: 'export function greeting(name: string) {',
    oldLine: 1,
    newLine: 1,
  },
  { type: 'remove', content: '  return name;', oldLine: 2 },
  { type: 'add', content: '  return `你好， ${name}`;', newLine: 2 },
  { type: 'context', content: '}', oldLine: 3, newLine: 3 },
]
</script>

<template>
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>圆角</s-tag>
      <s-file-diff
        v-model:expanded="expanded"
        shape="rounded"
        filename="greeting.ts"
        :lines="lines"
        @apply="decision = '已接受修改'"
        @reject="decision = '已拒绝修改'"
      />
      <s-tag v-if="decision">{{ decision }}</s-tag>
    </div>
    <div class="agent-demo">
      <s-tag>方角</s-tag>
      <s-file-diff
        v-model:expanded="expanded"
        shape="square"
        filename="greeting.ts"
        :lines="lines"
        @apply="decision = '已接受修改'"
        @reject="decision = '已拒绝修改'"
      />
      <s-tag v-if="decision">{{ decision }}</s-tag>
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
