<script setup lang="ts">
import { shallowRef } from 'vue'

const loading = shallowRef(true)
const roundedValue = shallowRef(false)
const squareValue = shallowRef(true)
const textValue = shallowRef(true)
</script>

<template>
  <div class="switch-state-examples">
    <div class="switch-loading-control">
      <s-switch v-model="loading" aria-label="加载状态" />
      <span>加载状态</span>
    </div>
    <s-switch
      v-model="roundedValue"
      :loading="loading"
      aria-label="圆角加载开关"
    />
    <s-switch
      v-model="squareValue"
      :loading="loading"
      shape="square"
      aria-label="方形加载开关"
    />
    <s-switch
      v-model="textValue"
      :loading="loading"
      variant="text"
      aria-label="文字加载开关"
    />
  </div>
</template>

<style scoped>
.switch-loading-control {
  flex-basis: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.switch-state-examples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>
