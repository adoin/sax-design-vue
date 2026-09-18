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
    field: 'Budget',
    category: 'Numeric change',
    color: 'success',
    before: '$30',
    after: '$50',
    details: [
      {
        id: '14-1',
        scope: 'Base budget',
        before: '$30',
        after: '$50',
        action: 'Updated',
        color: 'success',
      },
      {
        id: '14-2',
        scope: 'Weekend cap',
        before: '$12',
        after: '$18',
        action: 'Updated',
        color: 'success',
      },
    ],
  },
  {
    id: 15,
    field: 'Bid strategy',
    category: 'Threshold',
    color: 'primary',
    before: '$10',
    after: '$20',
    details: [
      {
        id: '15-1',
        scope: 'Bid cap',
        before: '$10',
        after: '$20',
        action: 'Updated',
        color: 'primary',
      },
      {
        id: '15-2',
        scope: 'Fallback mode',
        before: 'Manual',
        after: 'Automatic',
        action: 'Changed',
        color: 'primary',
      },
    ],
  },
  {
    id: 16,
    field: 'Schedule',
    category: 'Date change',
    color: 'success',
    before: '07-07',
    after: '07-08',
    details: [
      {
        id: '16-1',
        scope: 'Start date',
        before: '07-07',
        after: '07-08',
        action: 'Moved',
        color: 'success',
      },
      {
        id: '16-2',
        scope: 'End date',
        before: '07-20',
        after: '07-22',
        action: 'Moved',
        color: 'success',
      },
    ],
  },
  {
    id: 17,
    field: 'Name',
    category: 'Text change',
    color: 'success',
    before: 'XXXX',
    after: 'XXXXX',
    details: [
      {
        id: '17-1',
        scope: 'Campaign name',
        before: 'XXXX',
        after: 'XXXXX',
        action: 'Renamed',
        color: 'success',
      },
      {
        id: '17-2',
        scope: 'Internal label',
        before: 'Launch A',
        after: 'Launch B',
        action: 'Renamed',
        color: 'success',
      },
    ],
  },
  {
    id: 18,
    field: 'Region groups',
    category: 'Routing',
    color: 'primary',
    tokens: [
      { label: 'Targeting', value: '+4', color: 'success' },
      { label: '', value: '−1', color: 'danger' },
      { label: 'Exclusion', value: '+2', color: 'success' },
    ],
    details: [
      {
        id: '18-1',
        scope: 'Targeting · North America',
        before: 'Not included',
        after: 'Included',
        action: 'Added',
        color: 'success',
      },
      {
        id: '18-2',
        scope: 'Targeting · Europe',
        before: 'Not included',
        after: 'Included',
        action: 'Added',
        color: 'success',
      },
      {
        id: '18-3',
        scope: 'Targeting · Legacy audience',
        before: 'Included',
        after: 'Removed',
        action: 'Removed',
        color: 'danger',
      },
      {
        id: '18-4',
        scope: 'Exclusion · Low-conversion regions',
        before: '3 groups',
        after: '5 groups',
        action: 'Adjusted',
        color: 'primary',
      },
      {
        id: '18-5',
        scope: 'Exclusion · Existing customers',
        before: '2 groups',
        after: '3 groups',
        action: 'Adjusted',
        color: 'primary',
      },
    ],
  },
]
const columns: TableColumn<ChangeRow>[] = [
  { key: 'details', type: 'expand', width: 56 },
  { field: 'id', title: '#', width: 64 },
  { field: 'field', title: 'Field', minWidth: 150 },
  {
    key: 'summary',
    title: 'Change summary',
    minWidth: 360,
    slots: { default: 'changeSummary' },
  },
]
const detailColumns: TableColumn<ChangeDetail>[] = [
  { field: 'scope', title: 'Detailed item', minWidth: 210 },
  { field: 'before', title: 'Before', minWidth: 150 },
  { field: 'after', title: 'After', minWidth: 150 },
  {
    field: 'action',
    title: 'Result',
    width: 110,
    slots: { default: 'detailAction' },
  },
]
</script>

<template>
  <div class="details-demo">
    <div class="details-demo__controls">
      <s-button size="small" flat @click="expanded = []">
        Collapse all details
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
          :aria-label="`${row.field} change details`"
        >
          <header class="details-demo__detail-header">
            <strong>{{ row.field }}</strong>
            <span>{{ row.details.length }} detailed changes</span>
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
