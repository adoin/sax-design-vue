<template>
  <div class="center breadcrumb-color-demo">
    <s-color-picker v-model="colorx" aria-label="面包屑颜色" />
    <s-breadcrumb :color="colorx" :items="items" />
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'

const colorx = shallowRef('#3DC9B3')
const items = [
  { title: '工作台', url: 'dashboard' },
  { title: '一级页面', url: 'link-1' },
  { title: '不可用页面', disabled: true },
  { title: '当前位置', active: true },
]
</script>

<style scoped lang="scss">
.breadcrumb-color-demo {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  width: 100%;
}
</style>
