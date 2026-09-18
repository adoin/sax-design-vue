<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn, TableRowKey } from 'sax-design-vue'

type ChangeColor = 'primary' | 'success' | 'danger' | 'warn'

interface ChangeToken {
  label: string
  value: string
  color: ChangeColor
}

interface ChangeDetail {
  id: string
  scope: string
  before: string
  after: string
  action: string
  color: ChangeColor
}

interface ChangeRow {
  id: number
  field: string
  category: string
  color: ChangeColor
  before?: string
  after?: string
  tokens?: ChangeToken[]
  details: ChangeDetail[]
}

const expanded = ref<TableRowKey[]>([18])
const rows: ChangeRow[] = [
  {
    id: 14,
    field: '预算',
    category: '数值变更',
    color: 'success',
    before: '$30',
    after: '$50',
    details: [
      {
        id: '14-1',
        scope: '基础预算',
        before: '$30',
        after: '$50',
        action: '已更新',
        color: 'success',
      },
      {
        id: '14-2',
        scope: '周末上限',
        before: '$12',
        after: '$18',
        action: '已更新',
        color: 'success',
      },
    ],
  },
  {
    id: 15,
    field: '竞价策略',
    category: '出价上限',
    color: 'primary',
    before: '$10',
    after: '$20',
    details: [
      {
        id: '15-1',
        scope: '单次出价上限',
        before: '$10',
        after: '$20',
        action: '已更新',
        color: 'primary',
      },
      {
        id: '15-2',
        scope: '兜底模式',
        before: '手动',
        after: '自动',
        action: '已变更',
        color: 'primary',
      },
    ],
  },
  {
    id: 16,
    field: '排期',
    category: '日期变更',
    color: 'success',
    before: '07-07',
    after: '07-08',
    details: [
      {
        id: '16-1',
        scope: '开始日期',
        before: '07-07',
        after: '07-08',
        action: '已移动',
        color: 'success',
      },
      {
        id: '16-2',
        scope: '结束日期',
        before: '07-20',
        after: '07-22',
        action: '已移动',
        color: 'success',
      },
    ],
  },
  {
    id: 17,
    field: '名称',
    category: '文本变更',
    color: 'success',
    before: 'XXXX',
    after: 'XXXXX',
    details: [
      {
        id: '17-1',
        scope: '活动名称',
        before: 'XXXX',
        after: 'XXXXX',
        action: '已重命名',
        color: 'success',
      },
      {
        id: '17-2',
        scope: '内部标签',
        before: '发布 A',
        after: '发布 B',
        action: '已重命名',
        color: 'success',
      },
    ],
  },
  {
    id: 18,
    field: '地区组',
    category: '定向',
    color: 'primary',
    tokens: [
      { label: '定向', value: '+4', color: 'success' },
      { label: '', value: '−1', color: 'danger' },
      { label: '排除', value: '+2', color: 'success' },
    ],
    details: [
      {
        id: '18-1',
        scope: '定向 · 北美',
        before: '未包含',
        after: '已包含',
        action: '新增',
        color: 'success',
      },
      {
        id: '18-2',
        scope: '定向 · 欧洲',
        before: '未包含',
        after: '已包含',
        action: '新增',
        color: 'success',
      },
      {
        id: '18-3',
        scope: '定向 · 旧受众',
        before: '已包含',
        after: '已移除',
        action: '删除',
        color: 'danger',
      },
      {
        id: '18-4',
        scope: '排除 · 低转化地区',
        before: '3 个组',
        after: '5 个组',
        action: '调整',
        color: 'primary',
      },
      {
        id: '18-5',
        scope: '排除 · 已有客户',
        before: '2 个组',
        after: '3 个组',
        action: '调整',
        color: 'primary',
      },
    ],
  },
]
const columns: TableColumn<ChangeRow>[] = [
  { key: 'details', type: 'expand', width: 56 },
  { field: 'id', title: '#', width: 64 },
  { field: 'field', title: '字段', minWidth: 150 },
  {
    key: 'summary',
    title: '变更梗概',
    minWidth: 360,
    slots: { default: 'changeSummary' },
  },
]
const detailColumns: TableColumn<ChangeDetail>[] = [
  { field: 'scope', title: '明细项', minWidth: 210 },
  { field: 'before', title: '修改前', minWidth: 150 },
  { field: 'after', title: '修改后', minWidth: 150 },
  {
    field: 'action',
    title: '结果',
    width: 110,
    slots: { default: 'detailAction' },
  },
]
</script>

<template>
  <div class="details-demo">
    <div class="details-demo__controls">
      <s-button size="small" flat @click="expanded = []">
        收起全部详情
      </s-button>
    </div>
    <s-table
      v-model:detail-expanded-keys="expanded"
      :data="rows"
      :columns="columns"
      row-key="id"
    >
      <template #changeSummary="{ row }">
        <div class="details-demo__summary">
          <s-tag size="small" :color="row.color">{{ row.category }}</s-tag>
          <template v-if="row.before && row.after">
            <code class="details-demo__value">{{ row.before }}</code>
            <span class="details-demo__arrow" aria-hidden="true">→</span>
            <code class="details-demo__value">{{ row.after }}</code>
          </template>
          <template
            v-for="token in row.tokens"
            :key="`${token.label}:${token.value}`"
          >
            <span v-if="token.label" class="details-demo__token-label">{{
              token.label
            }}</span>
            <s-tag size="small" :color="token.color">{{ token.value }}</s-tag>
          </template>
        </div>
      </template>
      <template #detail="{ row }">
        <section
          class="details-demo__detail"
          :aria-label="`${row.field}变更明细`"
        >
          <header class="details-demo__detail-header">
            <strong>{{ row.field }}</strong>
            <span>{{ row.details.length }} 项细致变更</span>
          </header>
          <s-table
            class="details-demo__nested-table"
            :data="row.details"
            :columns="detailColumns"
            row-key="id"
          >
            <template #detailAction="{ row: detail }">
              <s-tag size="small" :color="detail.color">{{
                detail.action
              }}</s-tag>
            </template>
          </s-table>
        </section>
      </template>
    </s-table>
  </div>
</template>

<style scoped>
.details-demo {
  width: 100%;
}
.details-demo__controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
.details-demo__summary {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.details-demo__value,
.details-demo__token-label {
  padding: 2px 7px;
  border-radius: var(--sax-radius-sm);
  background: hsl(var(--sax-primary) / 0.06);
  color: hsl(var(--sax-text));
  font: inherit;
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}
.details-demo__arrow {
  color: hsl(var(--sax-text) / 0.42);
}
.details-demo__detail {
  display: grid;
  gap: 10px;
  padding: 4px 0 8px;
}
.details-demo__detail-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}
.details-demo__detail-header span {
  color: hsl(var(--sax-text) / 0.54);
  font-size: 0.75rem;
}
.details-demo__nested-table {
  box-shadow: 0 14px 30px -24px hsl(var(--sax-primary) / 0.52);
}
.details-demo__nested-table :deep(.s-table__data-head) {
  background: hsl(var(--sax-primary) / 0.06);
}
</style>
