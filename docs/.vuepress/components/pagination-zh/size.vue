<script setup lang="ts">
import { reactive } from 'vue'

const pages = reactive({ small: 1, default: 1, large: 1 })
</script>

<template>
  <div class="size-demo">
    <s-pagination
      v-model:current-page="pages.small"
      size="small"
      :total="50"
      layout="prev,pager,next"
    />
    <s-pagination
      v-model:current-page="pages.default"
      :total="50"
      layout="prev,pager,next"
    />
    <s-pagination
      v-model:current-page="pages.large"
      size="large"
      :total="50"
      layout="prev,pager,next"
    />
  </div>
</template>

<style scoped>
.size-demo {
  display: grid;
  gap: 12px;
}
</style>
