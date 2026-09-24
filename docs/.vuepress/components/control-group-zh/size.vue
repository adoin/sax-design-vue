<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({ small: '', default: '', large: '' })
</script>

<template>
  <div class="size-demo">
    <s-control-group size="small"
      ><s-input v-model="values.small" placeholder="小号" /><s-button
        >确定</s-button
      ></s-control-group
    >
    <s-control-group
      ><s-input v-model="values.default" placeholder="默认" /><s-button
        >确定</s-button
      ></s-control-group
    >
    <s-control-group size="large"
      ><s-input v-model="values.large" placeholder="大号" /><s-button
        >确定</s-button
      ></s-control-group
    >
  </div>
</template>

<style scoped>
.size-demo {
  display: grid;
  gap: 12px;
}
</style>
