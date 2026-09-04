<script setup lang="ts">
const rows = [
  { id: 1, name: 'Alex', team: 'Design', city: 'Paris' },
  { id: 2, name: 'Morgan', team: 'Engineering', city: 'London' },
]
</script>

<template>
  <s-table :data="rows" row-key="id" column-manager-config resize-config>
    <s-table-column field="id" title="ID" :width="72" />
    <s-table-column title="Member">
      <template #header>Member profile</template>
      <template #columns>
        <s-table-column field="name" title="Name" sortable :min-width="160">
          <template #default="{ row }"
            ><strong>{{ row.name }}</strong></template
          >
        </s-table-column>
        <s-table-column title="Organization">
          <template #columns>
            <s-table-column field="team" title="Team" :min-width="140" />
            <s-table-column field="city" title="City" :min-width="140" />
          </template>
        </s-table-column>
      </template>
    </s-table-column>
  </s-table>
</template>
