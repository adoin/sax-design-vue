<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const motionBlur = shallowRef(false)

const items = computed(() =>
  Array.from({ length: 4 }, (_, index) => ({
    title: `0${index + 1}`,
    description: isZh.value
      ? index % 2
        ? 'Sax 动效'
        : '聚焦内容'
      : index % 2
        ? 'Sax motion'
        : 'Focused content',
  })),
)
</script>

<template>
  <div class="fade-example">
    <div class="fade-example__controls">
      <s-button
        type="flat"
        size="small"
        :active="!motionBlur"
        @click="motionBlur = false"
      >
        {{ isZh ? '纯淡入淡出' : 'Plain fade' }}
      </s-button>
      <s-button
        type="flat"
        size="small"
        :active="motionBlur"
        @click="motionBlur = true"
      >
        {{ isZh ? '动态虚化' : 'Motion blur' }}
      </s-button>
    </div>

    <s-carousel
      :items="items"
      effect="fade"
      :motion-blur="motionBlur"
      :autoplay="false"
      indicator-type="number"
      height="220"
    >
      <template #item="{ item, index }">
        <div class="fade-slide" :class="`fade-slide--${index + 1}`">
          <strong>{{ item.title }}</strong>
          <span>{{ item.description }}</span>
        </div>
      </template>
    </s-carousel>
  </div>
</template>

<style scoped>
.fade-example {
  min-width: 0;
}
.fade-example__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.fade-slide {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 7px;
  color: white;
}
.fade-slide--1 {
  background: linear-gradient(135deg, #205cff, #724de8);
}
.fade-slide--2 {
  background: linear-gradient(135deg, #007e8d, #35bfa8);
}
.fade-slide--3 {
  background: linear-gradient(135deg, #c34a78, #ed7a5c);
}
.fade-slide--4 {
  background: linear-gradient(135deg, #573fb0, #9d63df);
}
.fade-slide strong {
  font-size: 28px;
}
.fade-slide span {
  font-size: 12px;
  opacity: 0.78;
}
</style>
