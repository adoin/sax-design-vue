<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import HomeGalleryTable from './HomeGalleryTable.vue'
import HomeGalleryAgent from './HomeGalleryAgent.vue'
import HomeGalleryVisual from './HomeGalleryVisual.vue'
import type { AnchorRouterAdapter } from 'sax-design-vue'
const props = defineProps<{
  locale: string
  router: AnchorRouterAdapter
  localize: (path: string) => string
}>()
const emit = defineEmits<{ navigate: [path: string] }>()
const active = shallowRef(0)
const zh = computed(() => props.locale === 'zh')
const anchorItems = computed(() => [
  {
    title: zh.value ? '表格与动态行高' : 'Table & dynamic rows',
    href: props.localize('/components/table/large-data-and-visualization.html'),
  },
  {
    title: zh.value ? '路由与页内锚点' : 'Routes & local anchors',
    href: props.localize('/components/anchor.html#anchor-route-boundary'),
  },
])
function navigate(path: string) {
  emit('navigate', path)
}
</script>
<template>
  <section
    class="feature-gallery"
    :aria-label="zh ? '组件交互展示' : 'Interactive component showcase'"
  >
    <s-tabs v-model="active" alignment="fixed"
      ><s-tab :label="zh ? '精选' : 'Highlights'" /><s-tab
        :label="zh ? '数据表格' : 'Data table'" /><s-tab label="Agent" /><s-tab
        :label="zh ? '视觉动效' : 'Visuals'"
    /></s-tabs>
    <div class="feature-gallery__content" :class="{ overview: active === 0 }">
      <HomeGalleryTable
        v-if="active === 0 || active === 1"
        :zh="zh"
        :compact="active === 0"
        class="feature-surface wide"
        @navigate="navigate"
      />
      <HomeGalleryAgent
        v-if="active === 0 || active === 2"
        :zh="zh"
        :compact="active === 0"
        class="feature-surface wide"
        @navigate="navigate"
      />
      <HomeGalleryVisual
        v-if="active === 0 || active === 3"
        :zh="zh"
        :compact="active === 0"
        class="feature-surface"
        @navigate="navigate"
      />
      <section v-if="active === 0" class="feature-surface route-preview">
        <strong>{{ zh ? '跨章节导航' : 'Navigate across chapters' }}</strong
        ><s-anchor
          :items="anchorItems"
          :router="router"
          :route-boundary="false"
        />
      </section>
    </div>
    <footer>
      <span>{{
        zh ? '真实组件，可直接操作' : 'Real components. Try them here.'
      }}</span
      ><s-button
        type="transparent"
        size="mini"
        @click="navigate('/components/')"
        >{{ zh ? '完整组件库' : 'All components' }} ↗</s-button
      >
    </footer>
  </section>
</template>
<style scoped lang="scss">
.feature-gallery {
  display: grid;
  gap: 16px;
  min-width: 0;
  padding: 20px;
  border-radius: 24px;
  background: hsl(var(--sax-theme-layout) / 0.95);
  box-shadow: 0 24px 70px rgb(55 43 145 / 0.12);
}
.feature-gallery__content {
  display: grid;
  gap: 12px;
}
.feature-gallery__content.overview {
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
}
.wide {
  grid-column: 1 / -1;
}
.feature-surface {
  padding: 14px;
  min-width: 0;
  border-radius: 16px;
  background: hsl(var(--sax-theme-bg2) / 0.48);
  box-shadow:
    inset 0 2px 6px hsl(var(--sax-theme-color) / 0.04),
    inset 0 -1px 2px hsl(var(--sax-theme-layout) / 0.65);
}
.route-preview {
  display: grid;
  gap: 8px;
  align-content: start;
}
.route-preview > strong {
  font-size: 13px;
}
.route-preview :deep(.s-anchor__link) {
  font-size: 11px;
}
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
footer > span {
  font-size: 10px;
  color: hsl(var(--sax-theme-color) / 0.5);
}
@media (max-width: 600px) {
  .feature-gallery {
    padding: 14px;
  }
  .feature-gallery__content.overview {
    grid-template-columns: 1fr;
  }
}
</style>
