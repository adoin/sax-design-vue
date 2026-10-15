<script setup lang="ts">
import { shallowRef } from 'vue'
import { SAnchor, SScrollbar } from 'sax-design-vue'
import type { ScrollbarInstance } from 'sax-design-vue'
const panel = shallowRef<ScrollbarInstance>()
const items = Array.from({ length: 24 }, (_, i) => ({
  href: '#long-zh-section-' + i,
  title: '章节 ' + (i + 1),
}))
const getContainer = () => panel.value?.wrapRef || window
</script>
<template>
  <div
    style="
      display: grid;
      grid-template-columns: minmax(140px, 1fr) minmax(0, 2fr);
      gap: 20px;
      width: 100%;
    "
  >
    <SAnchor
      :items="items"
      :max-height="220"
      :get-container="getContainer"
      :target-offset="8"
      :active-offset="16"
    />
    <SScrollbar ref="panel" height="220px" placement="outside" :gap="4">
      <section
        v-for="item in items"
        :id="item.href.slice(1)"
        :key="item.href"
        style="min-height: 120px; padding: 12px"
      >
        <h4>{{ item.title }}</h4>
        <p>在左侧目录内滚动或拖动外部滑块，访问最下方的章节。</p>
      </section>
    </SScrollbar>
  </div>
</template>
