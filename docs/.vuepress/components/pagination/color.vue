<script setup lang="ts">
import { shallowRef } from 'vue'
import type { Color } from 'sax-design-vue'

const page = shallowRef(1)
const color = shallowRef<Color>('success')
</script>

<template>
  <div class="pagination-color-demo">
    <div class="pagination-color-demo__options">
      <s-radio v-model="color" color="success" value="success">Success</s-radio>
      <s-radio v-model="color" color="danger" value="danger">Danger</s-radio>
      <s-radio v-model="color" color="warn" value="warn">Warning</s-radio>
      <s-radio v-model="color" color="dark" value="dark">Dark</s-radio>
      <s-radio v-model="color" color="#7d33ff" value="#7d33ff">HEX</s-radio>
      <s-radio v-model="color" color="rgb(59,222,200)" value="rgb(59,222,200)">
        RGB
      </s-radio>
    </div>
    <s-pagination v-model:current-page="page" :color="color" :total="50" />
  </div>
</template>

<style scoped>
.pagination-color-demo {
  display: grid;
  gap: 12px;
  width: 100%;
  overflow-x: auto;
  padding: 20px 12px;
}

.pagination-color-demo__options {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
}
</style>
