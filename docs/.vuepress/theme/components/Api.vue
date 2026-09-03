<script setup lang="ts">
import { computed } from 'vue'
import { usePageData, usePageFrontmatter } from '@vuepress/client'

import { useDocLocaleUi } from '../composables/docLocale'
import ApiTable from './ApiTable.vue'
import type { ComputedRef } from 'vue'
import type { PageData, PageFrontmatter } from '@vuepress/client'
import type {
  ThemeNormalApiFrontmatter,
  ThemeNormalApiTableKey,
  ThemeNormalPropsFrontmatter,
} from '../shared/frontmatter/normal'

type Tables = Record<string, ThemeNormalPropsFrontmatter[]>

const pageData: ComputedRef<PageData<{ title: string }>> = usePageData() as any
const pageFrontmatter: ComputedRef<PageFrontmatter<ThemeNormalApiFrontmatter>> =
  usePageFrontmatter() as any
const { t } = useDocLocaleUi()

const tables = computed<Tables>(() => {
  const source = {
    PROPS: pageFrontmatter.value.PROPS,
    CHILD_PROPS: pageFrontmatter.value.CHILD_PROPS,
    EVENTS: pageFrontmatter.value.EVENTS,
    SLOTS: pageFrontmatter.value.SLOTS,
    EXPOSES: pageFrontmatter.value.EXPOSES,
  }
  return Object.fromEntries(
    Object.entries(source).filter(
      ([, rows]) => Array.isArray(rows) && rows.length,
    ),
  ) as Tables
})

const tableLabel = (key: string) => {
  const pageLabels = pageFrontmatter.value.API_TITLES
  const pageLabel = pageLabels?.[key as ThemeNormalApiTableKey]
  if (pageLabel) return pageLabel
  const labels = t.value.apiTables as Record<string, string>
  return labels[key] || key
}
const tableSlug = (key: string) =>
  `api-${key.toLowerCase().replaceAll('_', '-')}`
</script>

<template>
  <section v-if="Object.keys(tables).length" id="s-api" class="con-api">
    <div class="content-api">
      <h2 id="api" class="api-heading">
        <a class="header-anchor" href="#api">API</a>
      </h2>
      <section v-for="(rows, key) in tables" :key="key" class="content-table">
        <h3 :id="tableSlug(key)">
          <a class="header-anchor" :href="`#${tableSlug(key)}`">{{
            tableLabel(key)
          }}</a>
        </h3>
        <ApiTable
          :rows="rows"
          :table-key="String(key)"
          :label="tableLabel(key)"
          :page-title="pageData.title"
          :definitions="pageFrontmatter.API_TYPE_DETAILS"
        />
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
.con-api {
  width: 100%;
  min-width: 0;
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px 48px;
}

.content-api {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 36px;
}

.api-heading {
  margin: 0;
}

.content-table {
  width: 100%;
  min-width: 0;
}

.content-table h3 {
  margin: 0 0 14px;
  color: hsl(var(--sax-theme-color));
  font-size: 1.2rem;
}

@media (max-width: 800px) {
  .con-api {
    padding: 20px 0 36px;
  }
}
</style>
