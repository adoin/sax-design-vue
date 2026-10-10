<script setup lang="ts">
import { ref } from 'vue'
const rounded = ref(
  'Select this passage to compare a rounded editor and its floating toolbar.',
)
const square = ref(
  'Select this passage to compare a square editor and its floating toolbar.',
)
const readonly = ref(false)
const disabled = ref(false)
const answer =
  'Geometry applies to the document surface and its floating controls together.'
</script>

<template>
  <div class="shape-demo">
    <div class="shape-demo__controls">
      <s-checkbox v-model="readonly">Read only</s-checkbox>
      <s-checkbox v-model="disabled">Disabled</s-checkbox>
    </div>
    <div class="shape-demo__editors">
      <s-ai-editor
        v-model="rounded"
        title="Rounded"
        shape="rounded"
        :readonly="readonly"
        :disabled="disabled"
        :answer="answer"
      />
      <s-ai-editor
        v-model="square"
        title="Square"
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
