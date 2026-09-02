<script setup lang="ts">
import { h, nextTick, shallowRef } from 'vue'
import type {
  TableColumn,
  TableInstance,
  TableRenderer,
  TableVirtualConfig,
  TableVirtualSource,
} from 'sax-design-vue'

interface PersonRow {
  id: number
  name: string
  department: string
  project: string
  location: string
  status: string
  email: string
  score: number
  updatedAt: string
  note?: string
  [key: string]: unknown
}

const columns: TableColumn<PersonRow>[] = [
  { field: 'id', title: '#', width: 76, align: 'right', fixed: 'left' },
  { field: 'name', title: 'Member', minWidth: 220 },
  { field: 'department', title: 'Department', minWidth: 160 },
  { field: 'project', title: 'Project', minWidth: 220 },
  { field: 'location', title: 'Location', minWidth: 160 },
  { field: 'status', title: 'Status', minWidth: 140 },
  { field: 'email', title: 'Email', minWidth: 260 },
  { field: 'score', title: 'Score', width: 110, renderer: 'score' },
  {
    field: 'updatedAt',
    title: 'Updated',
    minWidth: 180,
    fixed: 'right',
  },
]

const virtualConfig: TableVirtualConfig = {
  height: 340,
  estimateSize: 48,
  overscan: 8,
  dynamic: true,
  horizontal: true,
  columnOverscan: 2,
}

const rows: PersonRow[] = Array.from({ length: 10_000 }, (_, index) => ({
  id: index + 1,
  name: `Member ${index + 1}`,
  department: ['Design', 'Engineering', 'Operations'][index % 3],
  project: ['Design system', 'Workspace', 'Analytics'][index % 3],
  location: ['Shanghai', 'Singapore', 'Remote'][index % 3],
  status: ['Active', 'Reviewing', 'Planning'][index % 3],
  email: `member${index + 1}@example.com`,
  score: 60 + (index % 41),
  updatedAt: `2026-08-${String((index % 28) + 1).padStart(2, '0')}`,
  note:
    index % 7 === 0
      ? 'This optional second line makes the row taller and is measured automatically.'
      : undefined,
}))

const renderers: Record<string, TableRenderer<PersonRow>> = {
  score: {
    cell: ({ value }) =>
      h(
        'strong',
        { class: Number(value) >= 90 ? 'score-high' : 'score-normal' },
        String(value),
      ),
  },
}

interface MatrixRow {
  id: number
  [key: string]: unknown
}

const ROW_COUNT = 100_000
const COLUMN_COUNT = 100_000
const stressTableRef = shallowRef<TableInstance>()
const started = shallowRef(false)
const starting = shallowRef(false)

const virtualSource: TableVirtualSource<MatrixRow> = {
  rowCount: ROW_COUNT,
  columnCount: COLUMN_COUNT,
  fixedLeftCount: 2,
  fixedRightCount: 1,
  columnWidth: 120,
  row: (index) => ({ id: index + 1 }),
  rowKey: (index) => index + 1,
  column: (index) => ({
    key: `column-${index}`,
    title: index === 0 ? 'Row' : `C${index + 1}`,
    width: 120,
    fixed: index < 2 ? 'left' : index === COLUMN_COUNT - 1 ? 'right' : false,
    renderer: 'matrix',
  }),
}

const stressVirtualConfig: TableVirtualConfig = {
  height: 420,
  estimateSize: 38,
  overscan: 10,
  dynamic: true,
  horizontal: true,
  columnOverscan: 3,
}

const stressRenderers: Record<string, TableRenderer<MatrixRow>> = {
  matrix: {
    cell: ({ rowIndex, columnIndex }) => {
      const isLongCell =
        columnIndex > 1 &&
        columnIndex < COLUMN_COUNT - 1 &&
        (rowIndex + columnIndex) % 11 === 0
      return h(
        'span',
        {
          class: [
            columnIndex === 0 && 'row-anchor',
            isLongCell && 'matrix-cell--long',
          ],
        },
        columnIndex === 0
          ? `R${rowIndex + 1}`
          : isLongCell
            ? `Row ${rowIndex + 1} · column ${columnIndex + 1}: remeasure and cache this wrapped content after horizontal scrolling.`
            : `R${rowIndex + 1} · C${columnIndex + 1}`,
      )
    },
  },
}

const jumpToMiddle = () => {
  stressTableRef.value?.scrollToRow(Math.floor(ROW_COUNT / 2), 'center')
  stressTableRef.value?.scrollToColumn(Math.floor(COLUMN_COUNT / 2), 'center')
}

const jumpToEnd = () => {
  stressTableRef.value?.scrollToRow(ROW_COUNT - 1, 'end')
  stressTableRef.value?.scrollToColumn(COLUMN_COUNT - 2, 'end')
}

const reset = () => {
  stressTableRef.value?.scrollToRow(0, 'start')
  stressTableRef.value?.scrollToColumn(2, 'start')
}

const waitForPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })

const start = async () => {
  starting.value = true
  await nextTick()
  await waitForPaint()
  started.value = true
  starting.value = false
}

const stop = () => {
  started.value = false
}
</script>

<template>
  <div class="virtual-demo">
    <s-table
      :data="rows"
      :columns="columns"
      :virtual-config="virtualConfig"
      :renderers="renderers"
      row-key="id"
      striped
    >
      <template #cell-name="{ row, value }">
        <div class="person-cell">
          <strong>{{ value }}</strong>
          <span v-if="row.note">{{ row.note }}</span>
        </div>
      </template>
    </s-table>

    <div class="stress-demo">
      <div class="stress-toolbar">
        <span>Massive data</span>
        <div class="stress-actions">
          <template v-if="started">
            <s-button size="small" @click="reset">Start</s-button>
            <s-button size="small" @click="jumpToMiddle">Middle</s-button>
            <s-button size="small" @click="jumpToEnd">End</s-button>
            <s-button size="small" @click="stop">Stop test</s-button>
          </template>
        </div>
      </div>
      <div v-if="!started" class="stress-gate">
        <span>The stress grid mounts only after you start the test.</span>
        <s-button
          size="small"
          :loading="starting"
          :disabled="starting"
          @click="start"
        >
          {{ starting ? 'Starting…' : 'Start stress test' }}
        </s-button>
      </div>
      <s-table
        v-else
        ref="stressTableRef"
        :virtual-source="virtualSource"
        :virtual-config="stressVirtualConfig"
        :renderers="stressRenderers"
        row-key="id"
        striped
      />
    </div>
  </div>
</template>

<style scoped>
.virtual-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 24px;
}

.person-cell {
  display: grid;
  gap: 4px;
}

.person-cell span {
  max-width: 520px;
  color: hsl(var(--sax-text-color-secondary));
  font-size: 12px;
}

.score-high {
  color: hsl(var(--sax-success));
}

.score-normal {
  color: hsl(var(--sax-text-color-primary));
}

.stress-demo {
  display: grid;
  gap: 12px;
}

.stress-toolbar,
.stress-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stress-toolbar {
  justify-content: space-between;
  color: hsl(var(--sax-text-color-secondary));
  font-size: 13px;
}

.stress-gate {
  display: flex;
  min-height: 120px;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 20px;
  border-radius: var(--sax-radius-lg);
  background: hsl(var(--sax-primary) / 0.045);
  color: hsl(var(--sax-text-color-secondary));
  text-align: center;
}

.row-anchor {
  color: hsl(var(--sax-primary));
  font-weight: 700;
}

.matrix-cell--long {
  line-height: 1.45;
}

@media (max-width: 640px) {
  .stress-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .stress-gate {
    flex-direction: column;
  }
}
</style>
