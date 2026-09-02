<script setup lang="ts">
import { computed, h, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import type {
  TableCellRenderParams,
  TableColumn,
  TableRow,
} from 'sax-design-vue'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const value = shallowRef<string>()

const columns = computed<TableColumn[]>(() => [
  { field: 'name', title: isZh.value ? '服务' : 'Service', minWidth: 180 },
  { field: 'owner', title: isZh.value ? '负责人' : 'Owner', minWidth: 120 },
  {
    field: 'status',
    title: isZh.value ? '状态' : 'Status',
    minWidth: 110,
    renderer: 'status',
  },
])
const data = computed<TableRow[]>(() => [
  {
    id: 'gateway',
    name: isZh.value ? 'API 网关' : 'API gateway',
    owner: 'Mia',
    status: 'healthy',
  },
  {
    id: 'billing',
    name: isZh.value ? '账单服务' : 'Billing service',
    owner: 'Noah',
    status: 'warning',
  },
  {
    id: 'search',
    name: isZh.value ? '搜索索引' : 'Search index',
    owner: 'Ava',
    status: 'healthy',
  },
])
const renderers = {
  status: ({ value }: TableCellRenderParams) =>
    h(
      'span',
      { class: ['status', `is-${String(value)}`] },
      String(value) === 'healthy'
        ? isZh.value
          ? '正常'
          : 'Healthy'
        : isZh.value
          ? '关注'
          : 'Warning',
    ),
}
const popupConfig = { width: 520, maxHeight: 340 }
</script>

<template>
  <div class="table-select-demo">
    <s-table-select
      v-model="value"
      :data="data"
      :columns="columns"
      :renderers="renderers"
      :popup-config="popupConfig"
      label-key="name"
      clearable
      block
      :placeholder="isZh ? '选择服务' : 'Select a service'"
    >
      <template #selected="{ row }">
        <span class="selected-service">
          <s-icon name="cb:cube" />
          {{ row.name }} · {{ row.owner }}
        </span>
      </template>
      <template #cell-name="{ row }">
        <span class="service-name">
          <s-icon name="cb:cube" />
          {{ row.name }}
        </span>
      </template>
    </s-table-select>
    <p>{{ isZh ? '绑定值' : 'Bound value' }}：{{ value || '-' }}</p>
  </div>
</template>

<style scoped>
.table-select-demo {
  width: min(100%, 420px);
}

.table-select-demo p {
  margin: 10px 2px 0;
  color: var(--s-text-color-secondary);
  font-size: 12px;
}

.selected-service,
.service-name,
.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.selected-service .s-icon,
.service-name .s-icon {
  color: hsl(var(--sax-primary));
}

.status::before {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  content: '';
}

.status.is-healthy {
  color: hsl(var(--sax-success));
}

.status.is-warning {
  color: hsl(var(--sax-warning));
}
</style>
