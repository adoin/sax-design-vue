<script setup lang="ts">
import { shallowRef } from 'vue'

const page = shallowRef(1)
const pageSize = shallowRef(10)
</script>

<template>
  <div class="pagination-default-demo">
    <s-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="50"
    />
  </div>
</template>

<style scoped>
.pagination-default-demo {
  width: 100%;
  overflow-x: auto;
  padding: 6px 0;
}
</style>
