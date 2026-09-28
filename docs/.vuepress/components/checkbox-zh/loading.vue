<template>
  <div class="center con-checkbox">
    <s-switch v-model="loading">加载状态</s-switch>
    <s-checkbox v-model="option" :loading="loading">选中</s-checkbox>
    <s-checkbox v-model="option2" :loading="loading">未选中</s-checkbox>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const loading = ref(true)
const option = ref(true)
const option2 = ref(false)
</script>

<style scoped lang="scss">
.con-checkbox {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
