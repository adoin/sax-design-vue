<script setup lang="ts">
import { shallowRef } from 'vue'

const circlePage = shallowRef(1)
const squarePage = shallowRef(1)
</script>

<template>
  <div class="pagination-shape-demo">
    <div class="pagination-shape-demo__row">
      <span class="pagination-shape-demo__label">Circle</span>
      <s-pagination
        v-model:current-page="circlePage"
        :total="80"
        layout="prev,pager,next"
        shape="circle"
      />
    </div>
    <div class="pagination-shape-demo__row">
      <span class="pagination-shape-demo__label">Square</span>
      <s-pagination
        v-model:current-page="squarePage"
        :total="80"
        layout="prev,pager,next"
        shape="square"
      />
    </div>
  </div>
</template>

<style scoped>
.pagination-shape-demo {
  display: grid;
  gap: 18px;
  width: 100%;
}

.pagination-shape-demo__row {
  display: grid;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0;
}

.pagination-shape-demo__label {
  font-size: 0.82rem;
  font-weight: 600;
}
</style>
