<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { TableColumn } from 'sax-design-vue'
const props = defineProps<{ zh: boolean; compact?: boolean }>()
defineEmits<{ navigate: [path: string] }>()
const dynamic = shallowRef(true)
interface DemoRow {
  id: number
  task: string
  note: string
  status: string
  percent: number
  [key: string]: unknown
}
const rows = computed<DemoRow[]>(() => [
  {
    id: 1,
    task: props.zh ? '更新组件文档' : 'Update component docs',
    note: props.zh
      ? '中英文示例与 API 同步更新'
      : 'Keep examples and APIs in sync',
    status: 'success',
    percent: 100,
  },
  {
    id: 2,
    task: props.zh ? '整理季度工作汇报' : 'Prepare the quarterly report',
    note: props.zh
      ? '补充项目进展、风险与下一步安排，行高随内容自动适应。'
      : 'Include progress, risks and next steps. Row height adapts to the content.',
    status: 'primary',
    percent: 68,
  },
  {
    id: 3,
    task: props.zh ? '上线交互演示' : 'Ship interactive demos',
    note: '',
    status: 'warning',
    percent: 32,
  },
])
const columns = computed<TableColumn<DemoRow>[]>(() => [
  {
    field: 'task',
    title: props.zh ? '项目 / 任务' : 'Project / task',
    minWidth: 230,
    sortable: true,
    fixed: 'left',
    slots: { default: 'task' },
  },
  {
    field: 'status',
    title: props.zh ? '状态' : 'Status',
    width: 100,
    slots: { default: 'status' },
  },
  {
    field: 'percent',
    title: props.zh ? '进度' : 'Progress',
    width: 115,
    fixed: 'right',
    sortable: true,
    slots: { default: 'progress' },
  },
])
const labels = computed<Record<string, string>>(() =>
  props.zh
    ? { success: '已完成', primary: '进行中', warning: '待安排' }
    : { success: 'Done', primary: 'In progress', warning: 'Planned' },
)
</script>
<template>
  <section class="gallery-table">
    <header>
      <div>
        <strong>{{ zh ? '业务表格' : 'Data table' }}</strong
        ><span>{{
          zh
            ? '动态行高 · 固定列 · 排序'
            : 'Dynamic rows · Fixed columns · Sorting'
        }}</span>
      </div>
      <s-button
        size="mini"
        type="transparent"
        @click="
          $emit(
            'navigate',
            '/components/table/large-data-and-visualization.html',
          )
        "
        >{{ zh ? '探索' : 'Explore' }} ↗</s-button
      >
    </header>
    <s-switch
      v-if="!compact"
      v-model="dynamic"
      :aria-label="
        zh ? '按内容自动测量行高' : 'Measure row heights from content'
      "
      >{{
        zh ? '按内容自动测量行高' : 'Measure row heights from content'
      }}</s-switch
    >
    <s-table
      :data="rows"
      :columns="columns"
      row-key="id"
      size="small"
      :virtual-config="
        compact ? undefined : { height: 160, dynamic, horizontal: true }
      "
      striped
    >
      <template #task="{ row }"
        ><div class="task">
          <strong>{{ row.task }}</strong
          ><span v-if="row.note">{{ row.note }}</span>
        </div></template
      >
      <template #status="{ row }"
        ><s-tag :status="row.status" size="small">{{
          labels[row.status]
        }}</s-tag></template
      >
      <template #progress="{ row }"
        ><div class="progress">
          <s-progress
            :percent="row.percent"
            texture="bubbles"
            :height="7"
          /><span>{{ row.percent }}%</span>
        </div></template
      >
    </s-table>
    <p v-if="!compact">
      {{
        zh
          ? '点击表头排序；切换行高设置，观察长文本行的变化。'
          : 'Sort from the header; toggle dynamic heights to compare the longer row.'
      }}
    </p>
  </section>
</template>
<style scoped lang="scss">
.gallery-table {
  display: grid;
  gap: 12px;
  min-width: 0;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
header > div {
  display: grid;
  gap: 3px;
}
header strong {
  font-size: 13px;
}
header span,
p {
  font-size: 11px;
  color: hsl(var(--sax-theme-color) / 0.55);
}
p {
  margin: 0;
  line-height: 1.6;
}
.task {
  display: grid;
  gap: 3px;
  padding: 2px 0;
  white-space: normal;
}
.task strong {
  font-size: 12px;
  font-weight: 600;
}
.task span {
  font-size: 10px;
  line-height: 1.5;
  color: hsl(var(--sax-theme-color) / 0.55);
}
.progress {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
}
.progress :deep(.s-progress) {
  flex: 1;
}
</style>
