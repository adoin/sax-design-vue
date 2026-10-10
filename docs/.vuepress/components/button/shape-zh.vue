<script setup lang="ts">
import { ref } from 'vue'
const active = ref('rounded')
</script>

<template>
  <s-config-provider shape="square">
    <div class="button-shape-demo">
      <s-button
        shape="rounded"
        :active="active === 'rounded'"
        @click="active = 'rounded'"
        >圆角</s-button
      >
      <s-button
        shape="square"
        :active="active === 'square'"
        @click="active = 'square'"
        >方角</s-button
      >
      <s-button
        shape="circle"
        :active="active === 'circle'"
        @click="active = 'circle'"
        >圆形</s-button
      >
    </div>
  </s-config-provider>
</template>

<style scoped>
.button-shape-demo {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
