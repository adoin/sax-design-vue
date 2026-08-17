<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const orbitAngle = shallowRef(0)
const itemCount = shallowRef(8)

const items = computed(() =>
  Array.from({ length: itemCount.value }, (_, index) => ({
    title: isZh.value ? `轨道 ${index + 1}` : `Orbit ${index + 1}`,
    description: isZh.value
      ? index === 0
        ? '当前卡片对齐正前方'
        : '点击可见卡片切换'
      : index === 0
        ? 'The active card faces forward'
        : 'Click a visible card to switch',
  })),
)

const angles = computed(() => [
  { value: 0, label: isZh.value ? '自动均分' : 'Auto spacing' },
  { value: 34, label: isZh.value ? '固定 34°' : 'Fixed 34°' },
  { value: 56, label: isZh.value ? '固定 56°' : 'Fixed 56°' },
])
const counts = computed(() => [
  { value: 2, label: isZh.value ? '2 项 · 自动克隆' : '2 items · cloned' },
  { value: 3, label: isZh.value ? '3 项 · 自动克隆' : '3 items · cloned' },
  { value: 8, label: isZh.value ? '8 项' : '8 items' },
  { value: 10, label: isZh.value ? '10 项' : '10 items' },
  {
    value: 100,
    label: isZh.value ? '100 项 · 虚拟轨道' : '100 items · virtual',
  },
])
</script>

<template>
  <div class="orbit-example">
    <div class="orbit-example__toolbar">
      <div class="orbit-example__controls">
        <s-button
          v-for="count in counts"
          :key="count.value"
          type="flat"
          size="small"
          :active="itemCount === count.value"
          @click="itemCount = count.value"
        >
          {{ count.label }}
        </s-button>
      </div>
      <div class="orbit-example__controls">
        <s-button
          v-for="angle in angles"
          :key="angle.value"
          type="flat"
          size="small"
          :active="orbitAngle === angle.value"
          @click="orbitAngle = angle.value"
        >
          {{ angle.label }}
        </s-button>
      </div>
    </div>

    <s-carousel
      :items="items"
      effect="orbit"
      :autoplay="false"
      :radius="14"
      :depth="230"
      :perspective="1000"
      :orbit-angle="orbitAngle"
      :orbit-max-visible="10"
      draggable
      arrow="always"
      :indicator-position="itemCount > 20 ? 'none' : 'outside'"
      height="320"
    >
      <template #item="{ item, index }">
        <div class="orbit-slide" :class="`orbit-slide--${(index % 4) + 1}`">
          <span>0{{ index + 1 }}</span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.description }}</small>
        </div>
      </template>
    </s-carousel>
  </div>
</template>

<style scoped>
.orbit-example {
  min-width: 0;
}
.orbit-example__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px 18px;
  margin-bottom: 16px;
}
.orbit-example__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.orbit-slide {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
  padding: 16px;
  border-radius: inherit;
  color: white;
}
.orbit-slide--1 {
  background: linear-gradient(145deg, #285fff, #7656ee);
}
.orbit-slide--2 {
  background: linear-gradient(145deg, #007f94, #38c9b0);
}
.orbit-slide--3 {
  background: linear-gradient(145deg, #c8497b, #f47d65);
}
.orbit-slide--4 {
  background: linear-gradient(145deg, #5f43b7, #aa68e8);
}
.orbit-slide span {
  font-size: 9px;
  letter-spacing: 0.12em;
  opacity: 0.72;
}
.orbit-slide strong {
  font-size: 14px;
}
.orbit-slide small {
  font-size: 10px;
  opacity: 0.76;
}
</style>
