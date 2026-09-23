<script setup lang="ts">
import { shallowRef } from 'vue'

const compactPage = shallowRef(1)
const detailedPage = shallowRef(1)
const detailedPageSize = shallowRef(10)
const customPage = shallowRef(1)
</script>

<template>
  <div class="pagination-layout-demo">
    <div class="pagination-layout-demo__row">
      <span class="pagination-layout-demo__label">精简导航</span>
      <s-pagination
        v-model:current-page="compactPage"
        :total="120"
        layout="prev,pager,next"
      />
    </div>
    <div class="pagination-layout-demo__row">
      <span class="pagination-layout-demo__label">总数与每页条数</span>
      <s-pagination
        v-model:current-page="detailedPage"
        v-model:page-size="detailedPageSize"
        :total="120"
        layout="total,prev,pager,next,jumper,sizes"
      />
    </div>
    <div class="pagination-layout-demo__row">
      <span class="pagination-layout-demo__label">自定义插槽</span>
      <s-pagination
        v-model:current-page="customPage"
        :total="120"
        layout="prev,pager,slot,next"
      >
        <template #default="{ currentPage }">
          <span>第 {{ currentPage }} 页</span>
        </template>
      </s-pagination>
    </div>
  </div>
</template>

<style scoped>
.pagination-layout-demo {
  display: grid;
  gap: 18px;
  width: 100%;
}

.pagination-layout-demo__row {
  display: grid;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0;
}

.pagination-layout-demo__label {
  font-size: 0.82rem;
  font-weight: 600;
}
</style>
