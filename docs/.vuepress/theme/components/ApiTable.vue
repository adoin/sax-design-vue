<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { STable } from '@vuesax-alpha/components/table'
import { SButton } from '@vuesax-alpha/components/button'
import { SDialog } from '@vuesax-alpha/components/dialog'
import { SFocusTrap } from '@vuesax-alpha/components/focus-trap'
import { SIcon } from '@vuesax-alpha/components/icon'
import prism from 'prismjs'
import { useClipboard } from '@vueuse/core'
import { useDocLocaleUi } from '../composables/docLocale'
import { isExternal } from '../util'
import ApiTypeDetails from './ApiTypeDetails.vue'
import type { TableColumn } from '@vuesax-alpha/components/table'
import type {
  ThemeApiTypeDefinition,
  ThemeNormalPropsFrontmatter,
} from '../shared/frontmatter/normal'

const props = defineProps<{
  rows: ThemeNormalPropsFrontmatter[]
  tableKey: string
  label: string
  pageTitle: string
  definitions?: Record<string, ThemeApiTypeDefinition>
}>()

const { t } = useDocLocaleUi()
const labels = computed(() => t.value.apiColumns)
// Keep compact action tracks fixed; let text tracks share the remaining space.
// Their combined minimum (844px) fits the desktop documentation content area.
const columns = computed<TableColumn[]>(() => [
  {
    field: 'name',
    title:
      (t.value.apiRowNames as Record<string, string>)[props.tableKey] ||
      labels.value.property,
    minWidth: 128,
  },
  {
    field: 'type',
    title: labels.value.type,
    minWidth: 132,
    className: 'api-column-type',
  },
  {
    field: 'values',
    title:
      (t.value.apiValueColumns as Record<string, string>)[props.tableKey] ||
      labels.value.values,
    minWidth: 108,
  },
  { field: 'description', title: labels.value.description, minWidth: 220 },
  {
    field: 'default',
    title: labels.value.default,
    minWidth: 80,
    className: 'api-column-default',
  },
  { field: 'example', title: labels.value.example, width: 88 },
  { field: 'more', title: labels.value.more, width: 88, align: 'center' },
])

const getTypeDetails = (expression?: string | null) => {
  const definitions: Record<string, ThemeApiTypeDefinition> = {}
  const queue = expression?.match(/\b[A-Za-z_$][\w$]*\b/g) ?? []
  while (queue.length) {
    const name = queue.shift()!
    const definition = props.definitions?.[name]
    if (!definition || definitions[name]) continue
    definitions[name] = definition
    queue.push(...definition.references)
  }
  return definitions
}
const data = computed(() =>
  props.rows.map((row) => ({
    ...row,
    typeDetails: getTypeDetails(row.type),
    valuesList:
      row.values == null || row.values === ''
        ? []
        : String(row.values)
            .split(',')
            .map((value) => value.trim()),
  })),
)
const displayDefault = (value: unknown) =>
  value == null || value === '' ? '—' : value
const issueLink = (name: string) =>
  `https://github.com/adoin/sax-design-vue/issues/new?title=${encodeURIComponent(`[${props.pageTitle}] ${props.tableKey.toLowerCase()} (${name})`)}`

const codeOpen = ref(false)
const selectedCode = ref({ name: '', code: '' })
const codeDialog = useTemplateRef<HTMLElement>('codeDialog')
let codeTrigger: HTMLElement | null = null
const { copied, copy } = useClipboard({ legacy: true })
const source = computed(() =>
  selectedCode.value.code.replaceAll('<\\/script>', '<' + '/script>'),
)
const highlightedCode = computed(() =>
  prism.highlight(source.value, prism.languages.html, 'html'),
)
const openCode = (row: ThemeNormalPropsFrontmatter, event: MouseEvent) => {
  selectedCode.value = { name: row.name, code: row.code ?? '' }
  codeTrigger = (event.target as HTMLElement).closest('button')
  codeOpen.value = true
}
const restoreCodeFocus = async () => {
  await nextTick()
  codeTrigger?.focus()
}
</script>

<template>
  <div class="api-table" role="region" :aria-label="`${pageTitle} · ${label}`">
    <STable :data="data" :columns="columns" row-key="name">
      <template #cell-name="{ row }">
        <span :id="`api-${row.name}`" class="api-name">
          <router-link v-if="row.link && !isExternal(row.link)" :to="row.link">
            {{ row.name }} <SIcon name="bx:link" />
          </router-link>
          <a
            v-else-if="row.link"
            :href="row.link"
            rel="noreferrer"
            target="_blank"
          >
            {{ row.name }} <SIcon name="bx:link-external" />
          </a>
          <span v-else>{{ row.name }}</span>
          <Badge
            v-if="row.state"
            class="api-state"
            :text="row.state.text"
            :type="row.state.type"
          />
        </span>
      </template>
      <template #cell-type="{ row }">
        <ApiTypeDetails
          v-if="Object.keys(row.typeDetails).length"
          :type="row.type"
          :definitions="row.typeDetails"
          :labels="labels"
        />
        <span v-else>{{ row.type || '—' }}</span>
      </template>
      <template #cell-values="{ row }">
        <template v-if="row.valuesList.length">
          <span
            v-for="(value, index) in row.valuesList"
            :key="index"
            class="api-value"
            >{{ value }}</span
          >
        </template>
        <span v-else>—</span>
      </template>
      <template #cell-description="{ row }">
        <span v-html="row.description || '—'" />
      </template>
      <template #cell-default="{ row }">{{
        displayDefault(row.default)
      }}</template>
      <template #cell-example="{ row }">
        <div class="api-actions">
          <a v-if="row.usage" :href="row.usage" class="api-action">
            {{ labels.usage }} <SIcon name="bx:code-block" />
          </a>
          <SButton
            v-if="row.code"
            size="mini"
            type="flat"
            :aria-label="`${t.examples.viewCode}: ${row.name}`"
            @click="openCode(row, $event)"
          >
            {{ labels.open }} <SIcon name="bx:code-alt" />
          </SButton>
          <span v-if="!row.usage && !row.code" class="api-empty">—</span>
        </div>
      </template>
      <template #cell-more="{ row }">
        <div class="api-actions api-more">
          <a
            :href="issueLink(row.name)"
            :aria-label="`${t.examples.reportIssue}: ${row.name}`"
            class="api-icon-action"
            rel="noreferrer"
            target="_blank"
          >
            <SIcon name="bx:bug" />
          </a>
          <a
            href="https://github.com/adoin/sax-design-vue/"
            :aria-label="`${t.examples.viewSource}: ${row.name}`"
            class="api-icon-action"
            rel="noreferrer"
            target="_blank"
          >
            <SIcon name="bx:terminal" />
          </a>
        </div>
      </template>
    </STable>
  </div>

  <SDialog
    v-model="codeOpen"
    width="min(760px, calc(100vw - 32px))"
    lock-scroll
    not-close
    :show-header="false"
    @closed="restoreCodeFocus"
  >
    <SFocusTrap
      :trapped="codeOpen"
      :loop="true"
      :focus-trap-el="codeDialog || undefined"
    >
      <section
        ref="codeDialog"
        class="api-code"
        role="dialog"
        aria-modal="true"
        :aria-label="`${t.examples.code}: ${selectedCode.name}`"
        tabindex="-1"
      >
        <header class="api-code-header">
          <strong>{{ selectedCode.name }}</strong>
          <div class="api-actions">
            <SButton size="small" type="flat" @click="copy(source)">{{
              copied ? t.examples.copied : t.examples.copyCode
            }}</SButton>
            <SButton
              size="small"
              type="transparent"
              :aria-label="t.examples.closeCode"
              @click="codeOpen = false"
              ><SIcon name="bx:x"
            /></SButton>
          </div>
        </header>
        <pre class="language-html"><code v-html="highlightedCode" /></pre>
      </section>
    </SFocusTrap>
  </SDialog>
</template>

<style scoped lang="scss">
.api-table {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}
.api-table :deep(.s-table) {
  font-size: 0.8rem;
}
.api-table :deep(.s-table__data-head-cell),
.api-table :deep(.s-table__data-cell) {
  padding: 12px 10px;
}
.api-table :deep(.s-table__data-head-cell) {
  font-size: 0.75rem;
}
.api-table :deep(.s-table__data-cell) {
  align-items: flex-start;
  line-height: 1.55;
}
.api-table :deep(.s-table__data-cell.api-column-type) {
  color: hsl(var(--sax-accent-secondary));
}
.api-table :deep(.s-table__data-cell.api-column-default) {
  color: hsl(var(--sax-badge-tip-color));
}
.api-name {
  scroll-margin-top: 120px;
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
.api-value {
  display: inline-block;
  max-width: 100%;
  margin: 2px 0;
  padding: 2px 6px;
  border-radius: 6px;
  background: hsl(var(--sax-primary) / 0.09);
  color: hsl(var(--sax-theme-color));
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}
.api-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}
.api-actions :deep(.s-button) {
  margin: 0;
}
.api-more {
  justify-content: center;
  flex-wrap: nowrap;
}
.api-action,
.api-icon-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 4px;
  border-radius: 8px;
  background: hsl(var(--sax-primary) / 0.1);
  color: hsl(var(--sax-primary)) !important;
}
.api-action {
  min-height: 28px;
  padding: 4px 6px;
  font-size: 0.75rem;
}
.api-icon-action {
  width: 28px;
  height: 28px;
}
.api-action:focus-visible,
.api-icon-action:focus-visible {
  outline: 2px solid hsl(var(--sax-primary));
  outline-offset: 2px;
}
.api-empty {
  color: hsl(var(--sax-theme-color) / 0.45);
}
.api-code {
  min-width: 0;
}
.api-code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.api-code pre {
  max-height: 60vh;
  margin: 16px 0 0;
  padding: 18px;
  overflow: auto;
}
</style>
