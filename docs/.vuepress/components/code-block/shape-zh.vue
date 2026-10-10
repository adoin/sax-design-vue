<script setup lang="ts">
import { ref } from 'vue'
const expanded = ref(true)
const code =
  'export const sum = (a: number, b: number) => {\n  // 明确输入类型\n  return a + b\n}'
</script>

<template>
  <div class="agent-demo-shapes">
    <div class="agent-demo">
      <s-tag>圆角</s-tag>
      <s-code-block
        v-model:expanded="expanded"
        shape="rounded"
        :code="code"
        filename="sum.ts"
        language="ts"
      />
    </div>
    <div class="agent-demo">
      <s-tag>方角</s-tag>
      <s-code-block
        v-model:expanded="expanded"
        shape="square"
        :code="code"
        filename="sum.ts"
        language="ts"
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
