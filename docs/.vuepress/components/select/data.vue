<template>
  <div class="select-data-demo">
    <s-select
      v-model="value"
      filterable
      placeholder="Data driven options"
      :options="options"
      :option-props="{ value: 'id', label: 'text' }"
      :option-groups="groups"
      :option-group-props="{ label: 'title', options: 'items' }"
      :popup-config="{ width: 260 }"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { id: 'new', text: 'New York' },
  { id: 'ldn', text: 'London' },
]
const groups = [
  {
    title: 'Asia',
    items: [
      { id: 'sha', text: 'Shanghai' },
      { id: 'tky', text: 'Tokyo', disabled: true },
    ],
  },
]
</script>

<style scoped>
.select-data-demo {
  max-width: 260px;
}
</style>
