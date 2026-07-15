<template>
  <s-select v-model="value" class="m-2" placeholder="Select" size="large">
    <s-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </s-select>
  <s-select v-model="value" class="m-2" placeholder="Select">
    <s-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </s-select>
  <s-select v-model="value" class="m-2" placeholder="Select" size="small">
    <s-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </s-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
</script>
