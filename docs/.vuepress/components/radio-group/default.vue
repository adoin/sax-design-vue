<template>
  <s-radio-group v-model="value" type="button" :options="options" />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const value = ref('small')
const options = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
]
</script>
