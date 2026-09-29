<script setup lang="ts">
import { ref } from 'vue'
const disabled = ref(true)
const value = ref('这段内容在状态切换期间保留，恢复后可继续编辑。')
</script>

<template>
  <div class="textarea-state-example">
    <div class="textarea-state-example__control">
      <s-switch v-model="disabled" aria-label="禁用状态" />
      <span>禁用状态</span>
    </div>
    <s-textarea
      v-model="value"
      :disabled="disabled"
      show-word-count
      aria-label="说明"
    />
  </div>
</template>

<style scoped>
.textarea-state-example {
  display: grid;
  gap: 24px;
  width: 100%;
  min-width: 0;
}
.textarea-state-example__control {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
