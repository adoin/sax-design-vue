<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive<{
  small?: number
  default?: number
  large?: number
}>({})
const data = [{ id: 1, name: 'Project' }]
const columns = [{ field: 'name', title: 'Name' }]
</script>

<template>
  <div class="size-demo">
    <s-table-select
      v-model="values.small"
      size="small"
      placeholder="Small"
      :data="data"
      :columns="columns"
      label-key="name"
    />
    <s-table-select
      v-model="values.default"
      placeholder="Default"
      :data="data"
      :columns="columns"
      label-key="name"
    />
    <s-table-select
      v-model="values.large"
      size="large"
      placeholder="Large"
      :data="data"
      :columns="columns"
      label-key="name"
    />
  </div>
</template>

<style scoped>
.size-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 12px;
  align-items: center;
}
</style>
