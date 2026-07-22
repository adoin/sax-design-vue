<template>
  <s-carousel v-model="active" :items="items" :autoplay="false" height="190">
    <template #item="{ item }">
      <div class="slide" :style="{ background: item.color }">
        <strong>{{ item.title }}</strong>
        <span>{{ item.description }}</span>
      </div>
    </template>
  </s-carousel>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(0)
const items = [
  {
    title: 'Build',
    description: 'Reusable building blocks',
    color: 'linear-gradient(135deg, #5667f4, #8b72f6)',
  },
  {
    title: 'Compose',
    description: 'Keep visual rhythm consistent',
    color: 'linear-gradient(135deg, #2aa7a1, #5ac9b5)',
  },
  {
    title: 'Ship',
    description: 'Polished interaction states',
    color: 'linear-gradient(135deg, #e77a66, #f0a657)',
  },
]
</script>

<style scoped>
.slide {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 28px;
  color: white;
}
.slide strong {
  font-size: 24px;
}
.slide span {
  opacity: 0.84;
}
</style>
