<script setup lang="ts">
import { ref } from 'vue'
const rounded = ref('选中这段文字，查看圆角编辑器及其浮动工具栏。')
const square = ref('选中这段文字，查看直角编辑器及其浮动工具栏。')
const readonly = ref(false)
const disabled = ref(false)
const answer = '外形配置同时作用于文档表面和浮动控件。'
</script>

<template>
  <div class="shape-demo">
    <div class="shape-demo__controls">
      <s-checkbox v-model="readonly">只读</s-checkbox>
      <s-checkbox v-model="disabled">禁用</s-checkbox>
    </div>
    <div class="shape-demo__editors">
      <s-ai-editor
        v-model="rounded"
        title="圆角"
        shape="rounded"
        :readonly="readonly"
        :disabled="disabled"
        :answer="answer"
      />
      <s-ai-editor
        v-model="square"
        title="直角"
        shape="square"
        :readonly="readonly"
        :disabled="disabled"
        :answer="answer"
      />
    </div>
  </div>
</template>

<style scoped>
.shape-demo {
  display: grid;
  width: 100%;
  gap: 16px;
}
.shape-demo__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.shape-demo__editors {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
@media (max-width: 680px) {
  .shape-demo__editors {
    grid-template-columns: 1fr;
  }
}
</style>
