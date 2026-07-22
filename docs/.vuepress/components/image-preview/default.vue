<template>
  <div class="image-preview-demo">
    <img
      v-for="(url, index) in urls"
      :key="url"
      :src="url"
      alt=""
      @click="open(index)"
    />
    <s-image-preview
      v-model="visible"
      :url-list="urls"
      :initial-index="index"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const visible = ref(false)
const index = ref(0)
const urls = [
  'https://picsum.photos/id/58/560/360',
  'https://picsum.photos/id/64/560/360',
]
const open = (value: number) => {
  index.value = value
  visible.value = true
}
</script>

<style scoped>
.image-preview-demo {
  display: flex;
  gap: 12px;
}
.image-preview-demo img {
  width: 160px;
  height: 100px;
  border-radius: 10px;
  cursor: zoom-in;
  object-fit: cover;
}
</style>
