<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import type { CarouselInstance } from '@vuesax-alpha/components/carousel'

const carousel = shallowRef<CarouselInstance>()
const active = shallowRef(0)
const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const labels = computed(() =>
  isZh.value
    ? { previous: '上一张', play: '播放', pause: '暂停', next: '下一张' }
    : { previous: 'Previous', play: 'Play', pause: 'Pause', next: 'Next' },
)
const items = [
  { name: 'alpha', title: 'A' },
  { name: 'beta', title: 'B' },
  { name: 'gamma', title: 'C' },
]
</script>

<template>
  <div class="controls">
    <s-button icon :aria-label="labels.previous" @click="carousel?.prev()">
      ←
    </s-button>
    <s-button icon :aria-label="labels.play" @click="carousel?.play()">
      ▶
    </s-button>
    <s-button icon :aria-label="labels.pause" @click="carousel?.pause()">
      Ⅱ
    </s-button>
    <s-button icon :aria-label="labels.next" @click="carousel?.next()">
      →
    </s-button>
    <span>{{ active + 1 }} / {{ items.length }}</span>
  </div>
  <s-carousel
    ref="carousel"
    v-model="active"
    :items="items"
    effect="slide"
    :autoplay="false"
    height="210"
  >
    <template #item="{ item, index }">
      <div class="control-slide" :class="`control-slide--${index + 1}`">
        {{ item.title }}
      </div>
    </template>
  </s-carousel>
</template>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;
}
.controls span {
  min-width: 52px;
  color: hsl(var(--sax-text-color));
  font-size: 12px;
  text-align: center;
}
.control-slide {
  display: grid;
  height: 100%;
  place-items: center;
  color: white;
  font-size: 38px;
  font-weight: 700;
}
.control-slide--1 {
  background: linear-gradient(135deg, #245dff, #7354ec);
}
.control-slide--2 {
  background: linear-gradient(135deg, #008594, #3bc4aa);
}
.control-slide--3 {
  background: linear-gradient(135deg, #c84d7a, #f1845f);
}
</style>
