<script setup lang="ts">
const rows = [
  { id: 1, name: '小林', team: '设计', city: '巴黎' },
  { id: 2, name: '小周', team: '研发', city: '伦敦' },
]
</script>

<template>
  <s-table :data="rows" row-key="id" column-manager-config resize-config>
    <s-table-column field="id" title="编号" :width="72" />
    <s-table-column title="成员">
      <template #header>成员资料</template>
      <template #columns>
        <s-table-column field="name" title="姓名" sortable :min-width="160">
          <template #default="{ row }"
            ><strong>{{ row.name }}</strong></template
          >
        </s-table-column>
        <s-table-column title="组织信息">
          <template #columns>
            <s-table-column field="team" title="部门" :min-width="140" />
            <s-table-column field="city" title="城市" :min-width="140" />
          </template>
        </s-table-column>
      </template>
    </s-table-column>
  </s-table>
</template>
