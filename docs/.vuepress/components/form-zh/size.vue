<script setup lang="ts">
import { reactive } from 'vue'

const model = reactive({ small: '', default: '', large: '' })
</script>

<template>
  <div class="size-demo">
    <s-form size="small" :model="model"
      ><s-form-item label="小号"><s-input v-model="model.small" /></s-form-item
    ></s-form>
    <s-form :model="model"
      ><s-form-item label="默认"
        ><s-input v-model="model.default" /></s-form-item
    ></s-form>
    <s-form size="large" :model="model"
      ><s-form-item label="大号"><s-input v-model="model.large" /></s-form-item
    ></s-form>
  </div>
</template>

<style scoped>
.size-demo {
  display: grid;
  gap: 12px;
}
</style>
