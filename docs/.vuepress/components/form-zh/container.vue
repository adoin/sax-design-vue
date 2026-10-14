<script setup lang="ts">
import { reactive, ref } from 'vue'
const width = ref(320)
const model = reactive({ name: '', email: '' })
const items = [
  {
    field: 'name',
    title: '姓名',
    span: { xs: 24, sm: 12 },
    itemRender: { name: '$input' },
  },
  {
    field: 'email',
    title: '邮箱',
    span: { xs: 24, sm: 12 },
    itemRender: { name: '$input' },
  },
]
</script>
<template>
  <div class="container-demo">
    <div class="container-controls">
      <s-button size="small" @click="width = 320">320px 容器</s-button>
      <s-button size="small" @click="width = 640">640px 容器</s-button>
    </div>
    <div :style="{ width: `${width}px`, maxWidth: '100%' }">
      <s-form :model="model" :items="items" label-position="top" />
    </div>
  </div>
</template>
<style scoped>
.container-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.container-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
