<script setup lang="ts">
import { shallowRef } from 'vue'

const unchecked = shallowRef(false)
const checked = shallowRef(true)
</script>

<template>
  <div class="checkbox-states">
    <s-checkbox v-model="unchecked">正常 · 未选中</s-checkbox>
    <s-checkbox v-model="checked">正常 · 已选中</s-checkbox>
    <s-checkbox disabled :model-value="false">禁用 · 未选中</s-checkbox>
    <s-checkbox disabled :model-value="true">禁用 · 已选中</s-checkbox>
    <s-checkbox disabled indeterminate :model-value="true">
      禁用 · 半选
    </s-checkbox>
  </div>
</template>

<style scoped>
.checkbox-states {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
}
</style>
