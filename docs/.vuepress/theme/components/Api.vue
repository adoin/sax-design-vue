<template>
  <section
    v-if="
      pageFrontmatter.PROPS ||
      pageFrontmatter.CHILD_PROPS ||
      pageFrontmatter.SLOTS ||
      pageFrontmatter.EVENTS
    "
    id="s-api"
    class="con-api"
  >
    <div class="content-api">
      <section v-for="(rows, key) in tables" :key="key" class="content-table">
        <h3>{{ tableLabel(key) }}</h3>

        <s-table class="api-table">
          <template #thead>
            <tr>
              <th class="api-column-name">{{ labels.property }}</th>
              <th class="api-column-type">{{ labels.type }}</th>
              <th class="api-column-values">{{ labels.values }}</th>
              <th class="api-column-description">{{ labels.description }}</th>
              <th class="api-column-default">{{ labels.default }}</th>
              <th class="api-column-example">{{ labels.example }}</th>
              <th class="api-column-more">{{ labels.more }}</th>
            </tr>
          </template>

          <template #tbody>
            <template v-for="(row, index) in rows" :key="`${key}-${row.name}`">
              <tr :id="`api-${row.name}`">
                <td class="api-column-name">
                  <router-link
                    v-if="row.link && !isExternal(row.link)"
                    :to="row.link"
                  >
                    {{ row.name }} <s-icon name="bx:link" />
                  </router-link>
                  <a
                    v-else-if="row.link"
                    :href="row.link"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {{ row.name }} <s-icon name="bx:link-external" />
                  </a>
                  <span v-else>{{ row.name }}</span>
                  <Badge
                    v-if="row.state"
                    class="api-state"
                    :text="row.state.text"
                    :type="row.state.type"
                  />
                </td>
                <td class="api-column-type">{{ row.type || '—' }}</td>
                <td class="api-column-values" v-html="getValues(row.values)" />
                <td
                  class="api-column-description"
                  v-html="row.description || '—'"
                />
                <td class="api-column-default">{{ row.default || '—' }}</td>
                <td class="api-column-example">
                  <div class="api-actions">
                    <a v-if="row.usage" :href="row.usage" class="api-action">
                      {{ labels.usage }} <s-icon name="bx:code-block" />
                    </a>
                    <button
                      v-if="row.code"
                      class="api-action"
                      type="button"
                      @click="toggleCode(String(key), index)"
                    >
                      {{
                        isCodeOpen(String(key), index)
                          ? labels.close
                          : labels.open
                      }}
                      <s-icon
                        :name="
                          isCodeOpen(String(key), index)
                            ? 'bx:x'
                            : 'bx:code-alt'
                        "
                      />
                    </button>
                    <span v-if="!row.usage && !row.code" class="api-empty"
                      >—</span
                    >
                  </div>
                </td>
                <td class="api-column-more">
                  <a
                    :href="issueLink(row.name)"
                    :aria-label="t.examples.reportIssue"
                    class="api-icon-action"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <s-icon name="bx:bug" />
                  </a>
                  <a
                    href="https://github.com/adoin/sax-design-vue/"
                    :aria-label="t.examples.viewSource"
                    class="api-icon-action"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <s-icon name="bx:terminal" />
                  </a>
                </td>
              </tr>
              <tr
                v-if="row.code && isCodeOpen(String(key), index)"
                class="api-code-row"
              >
                <td colspan="7">
                  <button
                    class="api-code-copy"
                    type="button"
                    @click="copy(row.code)"
                  >
                    {{ copied ? t.examples.copied : t.examples.copyCode }}
                  </button>
                  <div v-html="getCode(row.code)" />
                </td>
              </tr>
            </template>
          </template>
        </s-table>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePageData, usePageFrontmatter } from '@vuepress/client'
import prism from 'prismjs'
import { useClipboard } from '@vueuse/core'

import { isExternal } from '../util'
import { useDocLocaleUi } from '../composables/docLocale'
import type { ComputedRef } from 'vue'
import type { PageData, PageFrontmatter } from '@vuepress/client'
import type {
  ThemeNormalApiFrontmatter,
  ThemeNormalPropsFrontmatter,
} from '../shared/frontmatter/normal'

type Tables = Record<string, ThemeNormalPropsFrontmatter>

const pageData: ComputedRef<PageData<{ title: string }>> = usePageData() as any
const pageFrontmatter: ComputedRef<PageFrontmatter<ThemeNormalApiFrontmatter>> =
  usePageFrontmatter() as any
const { t } = useDocLocaleUi()
const labels = computed(() => t.value.apiColumns)
const { copied, copy } = useClipboard({ legacy: true })
const openCodes = ref(new Set<string>())

const tables = computed<Tables>(() => {
  const source = {
    PROPS: pageFrontmatter.value.PROPS,
    CHILD_PROPS: pageFrontmatter.value.CHILD_PROPS,
    SLOTS: pageFrontmatter.value.SLOTS,
    events: pageFrontmatter.value.EVENTS,
    exposes: pageFrontmatter.value.EXPOSES,
  }
  return Object.fromEntries(
    Object.entries(source).filter(
      ([, rows]) => Array.isArray(rows) && rows.length,
    ),
  ) as Tables
})

const tableLabel = (key: string) => {
  const labels = t.value.apiTables as Record<string, string>
  return labels[key] || key
}
const codeKey = (table: string, index: number) => `${table}-${index}`
const isCodeOpen = (table: string, index: number) =>
  openCodes.value.has(codeKey(table, index))
const toggleCode = (table: string, index: number) => {
  const next = new Set(openCodes.value)
  const key = codeKey(table, index)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  openCodes.value = next
}
const getValues = (values?: string) => {
  if (!values) return '—'
  return values
    .split(',')
    .map((value) => `<span class="value-span">${value.trim()}</span>`)
    .join('')
}
const getCode = (code: string) => {
  const html = prism.highlight(code, prism.languages.html, 'html')
  return `<pre class="language-html"><code>${html}</code></pre>`
}
const issueLink = (name: string) =>
  `https://github.com/adoin/sax-design-vue/issues/new?title=[${pageData.value.title}]%20prop%20(${name})`
</script>

<style lang="scss">
@use '../styles/use' as *;

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

.content-table {
  width: 100%;
  min-width: 0;
}

.content-table h3 {
  margin: 0 0 14px;
  color: hsl(var(--sax-theme-color));
  font-size: 1.2rem;
}

.api-table {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow-x: auto;
  border-radius: 14px;
  background: hsl(var(--sax-theme-layout));
}

.api-table .s-table {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.api-table table {
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
  background: transparent;
}

.api-table th,
.api-table td {
  padding: 14px 12px;
  border: 0;
  border-bottom: 1px solid hsl(var(--sax-theme-color) / 0.08);
  color: hsl(var(--sax-theme-color));
  text-align: left;
  vertical-align: top;
}

.api-table th {
  background: hsl(var(--sax-primary) / 0.08);
  color: hsl(var(--sax-theme-color));
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.25;
  white-space: nowrap;
}

.api-table td {
  font-size: 0.8rem;
  line-height: 1.55;
}

.api-table tbody tr:last-child td {
  border-bottom: 0;
}

.api-column-name {
  width: 17%;
  min-width: 150px;
}

.api-column-type {
  width: 10%;
  min-width: 86px;
  color: hsl(var(--sax-accent-secondary)) !important;
}

.api-column-values {
  width: 17%;
  min-width: 150px;
}

.api-column-description {
  min-width: 250px;
}

.api-column-default {
  width: 12%;
  min-width: 110px;
  color: hsl(var(--sax-badge-tip-color)) !important;
}

.api-column-example {
  width: 12%;
  min-width: 126px;
  white-space: nowrap;
}

.api-column-more {
  width: 70px;
  min-width: 70px;
  text-align: center !important;
  white-space: nowrap;
}

.api-table a {
  color: inherit;
  text-decoration: none;
}

.api-table a:hover {
  color: hsl(var(--sax-primary));
}

.api-state {
  margin-left: 6px;
}

.value-span {
  display: inline-flex;
  margin: 2px;
  padding: 2px 6px;
  border-radius: 6px;
  background: hsl(var(--sax-primary) / 0.09);
  color: hsl(var(--sax-theme-color));
  font-size: 0.7rem;
}

.api-actions,
.api-column-more {
  display: flex;
  align-items: center;
  gap: 6px;
}

.api-actions {
  flex-wrap: wrap;
}

.api-action,
.api-icon-action,
.api-code-copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 0;
  border-radius: 8px;
  background: hsl(var(--sax-primary) / 0.1);
  color: hsl(var(--sax-primary)) !important;
  cursor: pointer;
  font: inherit;
}

.api-action {
  min-height: 28px;
  padding: 4px 8px;
  font-size: 0.72rem;
}

.api-icon-action {
  width: 28px;
  height: 28px;
}

.api-empty {
  color: hsl(var(--sax-theme-color) / 0.45);
}

.api-code-row td {
  position: relative;
  padding: 0;
  background: hsl(var(--sax-primary) / 0.04);
}

.api-code-row pre {
  max-width: 100%;
  margin: 0;
  padding: 18px;
  overflow: auto;
}

.api-code-copy {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  padding: 6px 10px;
  font-size: 0.72rem;
}

@media (max-width: 800px) {
  .con-api {
    padding: 20px 0 36px;
  }

  .api-table {
    border-radius: 0;
  }
}
</style>
