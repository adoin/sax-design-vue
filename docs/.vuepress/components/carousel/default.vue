<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

const active = shallowRef(0)
const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const items = computed(() =>
  isZh.value
    ? [
        { name: 'build', title: '构建', description: '可复用的基础模块' },
        { name: 'compose', title: '组合', description: '统一的视觉节奏' },
        { name: 'ship', title: '交付', description: '完整的交互状态' },
      ]
    : [
        {
          name: 'build',
          title: 'Build',
          description: 'Reusable building blocks',
        },
        {
          name: 'compose',
          title: 'Compose',
          description: 'Consistent visual rhythm',
        },
        {
          name: 'ship',
          title: 'Ship',
          description: 'Polished interaction states',
        },
      ],
)
</script>

<template>
  <s-carousel v-model="active" :items="items" :autoplay="false" height="210">
    <template #item="{ item, index }">
      <div class="slide" :class="`slide--${index + 1}`">
        <span>0{{ index + 1 }}</span>
        <strong>{{ item.title }}</strong>
        <small>{{ item.description }}</small>
      </div>
    </template>
  </s-carousel>
</template>

<style scoped>
.slide {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  padding: 30px 56px;
  color: white;
}
.slide--1 {
  background: linear-gradient(135deg, #2563ff, #725cff);
}
.slide--2 {
  background: linear-gradient(135deg, #008d92, #37c6aa);
}
.slide--3 {
  background: linear-gradient(135deg, #d85d77, #ff9a58);
}
.slide span {
  font-size: 12px;
  letter-spacing: 0.18em;
  opacity: 0.72;
}
.slide strong {
  font-size: 25px;
}
.slide small {
  opacity: 0.82;
}
</style>
