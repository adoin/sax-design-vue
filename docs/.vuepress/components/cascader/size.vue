<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive<{
  small: string[]
  default: string[]
  large: string[]
}>({
  small: [],
  default: [],
  large: [],
})
const options = [{ label: 'Frontend', value: 'frontend' }]
</script>

<template>
  <div class="size-demo">
    <s-cascader
      v-model="values.small"
      size="small"
      placeholder="Small"
      :options="options"
    />
    <s-cascader
      v-model="values.default"
      placeholder="Default"
      :options="options"
    />
    <s-cascader
      v-model="values.large"
      size="large"
      placeholder="Large"
      :options="options"
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
