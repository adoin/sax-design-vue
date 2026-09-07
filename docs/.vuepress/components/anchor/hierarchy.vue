<template>
  <div class="anchor-demo-hierarchy">
    <s-anchor :items="items" :target-offset="104" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const items = computed(() => [
  {
    href: '#anchor-hierarchy',
    title: isZh.value ? '分级锚点' : 'Hierarchy',
    collapsible: true,
    children: [
      {
        href: '#anchor-secondary',
        title: isZh.value ? '二级链接' : 'Secondary link',
      },
      {
        href: '#anchor-horizontal',
        title: isZh.value ? '导航模式' : 'Navigation modes',
        collapsible: true,
        children: [
          {
            href: '#anchor-container',
            title: isZh.value ? '滚动容器' : 'Scroll container',
          },
        ],
      },
    ],
  },
  { href: '#api', title: 'API' },
])
</script>

<style scoped>
.anchor-demo-hierarchy {
  min-height: 218px;
  padding: 18px;
}
</style>
