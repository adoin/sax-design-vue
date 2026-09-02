<script setup lang="ts">
import { shallowRef } from 'vue'

const visible = shallowRef(false)
const index = shallowRef(0)
const urls = [
  'https://picsum.photos/id/58/1200/800',
  'https://picsum.photos/id/64/1200/800',
  'https://picsum.photos/id/96/1200/800',
]
const descriptions = [
  'Preview photograph 1',
  'Preview photograph 2',
  'Preview photograph 3',
]

const open = (value: number) => {
  index.value = value
  visible.value = true
}
</script>

<template>
  <div class="image-preview-demo">
    <button
      v-for="(url, imageIndex) in urls"
      :key="url"
      class="image-preview-demo__trigger"
      type="button"
      :aria-label="`Preview image ${imageIndex + 1}: ${descriptions[imageIndex]}`"
      @click="open(imageIndex)"
    >
      <img :src="url" :alt="descriptions[imageIndex]" />
    </button>

    <s-image-preview
      v-model="visible"
      :url-list="urls"
      :alt-list="descriptions"
      :initial-index="index"
    />
  </div>
</template>

<style scoped>
.image-preview-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  width: min(100%, 560px);
}

.image-preview-demo__trigger {
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: transparent;
  box-shadow: 0 6px 18px rgb(30 41 59 / 0.14);
  cursor: zoom-in;
}

.image-preview-demo__trigger:focus-visible {
  outline: 3px solid rgb(var(--sax-primary));
  outline-offset: 3px;
}

.image-preview-demo__trigger img {
  display: block;
  width: 100%;
  height: 104px;
  object-fit: cover;
  transition: transform var(--sax-motion-duration-fast)
    var(--sax-motion-easing-standard);
}

.image-preview-demo__trigger:hover img {
  transform: scale(1.04);
}
</style>
