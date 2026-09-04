<script setup lang="ts">
import { ref } from 'vue'
import type {
  TableClipboardResult,
  TableColumn,
  TableExposes,
  TableHistoryState,
} from 'sax-design-vue'
const table = ref<TableExposes>()
const history = ref<TableHistoryState>({
  undoCount: 0,
  redoCount: 0,
  canUndo: false,
  canRedo: false,
})
const message = ref('选择区域后复制或粘贴。')
const reasons: Record<string, string> = {
  disabled: '功能未开启',
  empty: '请先选择区域',
  editing: '请先保存或取消编辑',
  readonly: '目标为只读',
  cancelled: '已取消',
  limit: '超出区域或文本上限',
  shape: '区域尺寸或合并范围不匹配',
  validation: '校验失败，请检查单元格提示',
  clipboard: '浏览器未允许剪贴板访问',
  conflict: '源数据已变化',
  rejected: '数据所有者拒绝更新',
  busy: '另一项写入尚未完成',
  invalid: '数据格式不正确',
}
const report = (result: TableClipboardResult) => {
  message.value = result.success
    ? `操作完成；变更单元格：${result.changedCells}`
    : (reasons[result.reason ?? 'invalid'] ?? result.reason) +
      (result.clipboardWritten === true ? '；已复制，原数据未清空' : '')
}
const strict = ref(false)
const grouped = ref(false)
const virtual = ref(false)
const rows = ref(
  Array.from({ length: 24 }, (_, id) => ({
    id,
    name: `项目 ${id + 1}`,
    team: id < 12 ? '研发' : '设计',
    score: 60 + id,
    note: id % 4 === 0 ? '含换行的备注\n第二行' : '可编辑备注',
  })),
)
const columns: TableColumn[] = [
  { field: 'id', title: '编号（只读）', width: 120, fixed: 'left' },
  { field: 'name', title: '项目', width: 170, editor: true },
  { field: 'score', title: '得分', width: 140, editor: { type: 'number' } },
  { field: 'team', title: '部门', width: 150, editor: true },
  { field: 'note', title: '备注', width: 200, editor: true, fixed: 'right' },
]
const selectSample = () =>
  table.value?.setCellRange({
    anchor: { rowKey: 0, columnKey: 'name' },
    focus: { rowKey: 1, columnKey: 'score' },
  })
const pasteSample = async () => {
  if (await selectSample())
    await table.value?.pasteCells([
      ['新项目 A', 88],
      ['新项目 B', 92],
    ])
}
</script>
<template>
  <div class="clipboard-demo">
    <div class="clipboard-demo__controls">
      <s-button size="small" @click="selectSample">选择示例区域</s-button>
      <s-button size="small" flat @click="table?.copyCells()">复制</s-button>
      <s-button size="small" flat @click="table?.cutCells()">剪切</s-button>
      <s-button size="small" flat @click="table?.pasteCells()">粘贴</s-button>
      <s-button
        size="small"
        flat
        :disabled="!history.canUndo"
        @click="table?.undo()"
        >撤销</s-button
      >
      <s-button
        size="small"
        flat
        :disabled="!history.canRedo"
        @click="table?.redo()"
        >重做</s-button
      >
      <s-button size="small" flat @click="table?.cancelClipboard()"
        >取消操作</s-button
      >
      <s-button size="small" flat @click="pasteSample">粘贴二维数据</s-button>
      <s-checkbox v-model="strict">项目名称必填</s-checkbox>
      <s-checkbox v-model="grouped">按部门分组</s-checkbox>
      <s-checkbox v-model="virtual">虚拟滚动</s-checkbox>
    </div>
    <s-table
      ref="table"
      v-model:data="rows"
      :columns="columns"
      row-key="id"
      range-config
      clipboard-config
      edit-config
      change-config
      history-config
      validation-config
      :validation-rules="{
        name: strict ? { required: true } : {},
        score: { type: 'number', min: 0, max: 100 },
      }"
      :group-config="grouped ? { fields: ['team'] } : false"
      :virtual-config="
        virtual ? { height: 280, horizontal: true, dynamic: true } : false
      "
      resize-config
      @clipboard="report"
      @history-change="history = $event"
    />
    <p role="status">{{ message }}</p>
  </div>
</template>
<style scoped>
.clipboard-demo {
  width: 100%;
}
.clipboard-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.clipboard-demo > p {
  margin: 12px 0 0;
}
</style>
