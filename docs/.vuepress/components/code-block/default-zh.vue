<script setup lang="ts">
import { ref } from 'vue'
const expanded = ref(true)
const code =
  'export const sum = (a: number, b: number) => {\n  // 明确输入类型\n  return a + b\n}'
</script>

<template>
  <div class="agent-demo">
    <s-code-block
      v-model:expanded="expanded"
      :code="code"
      filename="sum.ts"
      language="ts"
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
