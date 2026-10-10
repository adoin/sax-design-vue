<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
const explored = ref('')
const items = [
  {
    name: 'lake',
    title: '南昆巴半岛',
    description: '马拉维 · 马拉维湖',
    src: 'https://kobra.systems/images/carousel/2.webp',
    alt: '碧绿湖水与岩石岸线',
  },
  {
    name: 'fjord',
    title: '图菲峡湾',
    description: '巴布亚新几内亚 · 奥罗省',
    src: 'https://kobra.systems/images/carousel/1.webp',
    alt: '绿意海岸与开阔水面',
  },
  {
    name: 'island',
    title: '乌图拉艾纳观景台',
    description: '汤加 · 瓦瓦乌',
    src: 'https://kobra.systems/images/carousel/3.webp',
    alt: '俯瞰海洋的岛屿',
  },
  {
    name: 'valley',
    title: '鄂尔浑河谷',
    description: '蒙古 · 后杭爱省',
    src: 'https://kobra.systems/images/carousel/4.webp',
    alt: '开阔的绿色河谷',
  },
  {
    name: 'villa',
    title: '艾伦洛克别墅',
    description: '法国 · 安提布海角',
    src: 'https://kobra.systems/images/carousel/5.webp',
    alt: '地中海岸边的建筑',
  },
]
</script>

<template>
  <div class="arc-demo">
    <s-carousel
      v-model="active"
      :items="items"
      effect="arc"
      height="360"
      :autoplay="false"
      draggable
      arrow="always"
      indicator-position="none"
    >
      <template #caption="{ item }">
        <strong>{{ item.title }}</strong>
        <span>{{ item.description }}</span>
        <s-button size="small" color="dark" @click="explored = item.title"
          >探索</s-button
        >
      </template>
    </s-carousel>
    <p v-if="explored" aria-live="polite">已选择目的地：{{ explored }}</p>
  </div>
</template>

<style scoped>
.arc-demo {
  width: 100%;
}
.arc-demo p {
  margin: 12px 0 0;
  color: var(--sax-css-primary);
  text-align: center;
  font-size: 13px;
}
</style>
