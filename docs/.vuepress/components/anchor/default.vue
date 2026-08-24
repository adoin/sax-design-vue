<template>
  <aside class="anchor-page-demo">
    <p class="anchor-page-demo__label">
      {{ isZh ? '本页导航' : 'On this page' }}
    </p>
    <s-anchor affix :items="items" :offset="104" :target-offset="104" />
  </aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const items = computed(() =>
  isZh.value
    ? [
        { href: '#anchor-default', title: '默认用法' },
        {
          href: '#anchor-hierarchy',
          title: '分级锚点',
          children: [
            { href: '#anchor-secondary', title: '二级链接' },
            { href: '#anchor-horizontal', title: '横向模式' },
          ],
        },
        { href: '#anchor-container', title: '滚动容器' },
        { href: '#api', title: 'API' },
      ]
    : [
        { href: '#anchor-default', title: 'Default' },
        {
          href: '#anchor-hierarchy',
          title: 'Hierarchy',
          children: [
            { href: '#anchor-secondary', title: 'Secondary link' },
            { href: '#anchor-horizontal', title: 'Horizontal' },
          ],
        },
        { href: '#anchor-container', title: 'Scroll container' },
        { href: '#api', title: 'API' },
      ],
)
</script>

<style scoped>
.anchor-page-demo {
  position: relative;
  z-index: 1;
  float: right;
  width: 184px;
  margin: 0 0 24px 28px;
}

.anchor-page-demo__label {
  margin: 0 0 8px 10px;
  color: hsl(var(--sax-theme-color) / 0.6);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

@media (max-width: 840px) {
  .anchor-page-demo {
    float: none;
    width: auto;
    margin: 0 0 20px;
  }

  .anchor-page-demo :deep(.s-anchor) {
    position: static;
    width: 100%;
  }
}
</style>
