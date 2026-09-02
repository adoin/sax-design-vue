<script setup lang="ts">
import { shallowRef } from 'vue'

const selected = shallowRef('selected')
</script>

<template>
  <div class="radio-states">
    <s-radio-group v-model="selected">
      <s-radio value="unselected">正常 · 未选中</s-radio>
      <s-radio value="selected">正常 · 已选中</s-radio>
    </s-radio-group>
    <s-radio disabled model-value="selected" value="unselected">
      禁用 · 未选中
    </s-radio>
    <s-radio disabled model-value="selected" value="selected">
      禁用 · 已选中
    </s-radio>
  </div>
</template>

<style scoped>
.radio-states {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
}
</style>
