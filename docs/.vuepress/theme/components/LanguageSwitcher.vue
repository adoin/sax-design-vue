<template>
  <div v-if="alternates.length" class="lang-switcher">
    <router-link
      v-for="item in alternates"
      :key="item.locale"
      class="lang-switcher__link"
      :to="item.link"
      :title="item.label"
    >
      {{ item.short }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteLocale } from '@vuepress/client'

type Alternate = {
  locale: string
  link: string
  label: string
  short: string
}

const route = useRoute()
const routeLocale = useRouteLocale()

function toEnglishPath(path: string) {
  if (!path.startsWith('/zh/')) return path
  const stripped = path.replace(/^\/zh(?=\/|$)/, '')
  return stripped || '/'
}

function toChinesePath(path: string) {
  if (path.startsWith('/zh/')) return path
  if (path === '/') return '/zh/'
  return `/zh${path}`
}

const alternates = computed<Alternate[]>(() => {
  const current = route.path
  const isZh = routeLocale.value === '/zh/'
  const items: Alternate[] = []

  if (!isZh) {
    items.push({
      locale: 'zh',
      link: toChinesePath(current),
      label: '切换到简体中文',
      short: '中文',
    })
  } else {
    items.push({
      locale: 'en',
      link: toEnglishPath(current),
      label: 'Switch to English',
      short: 'EN',
    })
  }

  return items
})
</script>

<style lang="scss" scoped>
@import '../styles/use';

.lang-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 4px;
}

.lang-switcher__link {
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(var(--sax-theme-color), 0.72);
  text-decoration: none;
  border: 1px solid rgba(var(--sax-accent-color), 0.18);
  background: rgba(var(--sax-theme-layout), 0.65);
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;

  &:hover {
    color: rgb(var(--sax-accent-color));
    border-color: rgba(var(--sax-accent-color), 0.35);
    background: rgba(var(--sax-accent-color), 0.08);
  }
}
</style>
