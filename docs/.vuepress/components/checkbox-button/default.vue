<template>
  <div>
    <s-checkbox-button
      v-for="item in options"
      :key="item"
      v-model="value"
      :value="item"
      >{{ item }}</s-checkbox-button
    >
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const value = ref<string[]>(['Email'])
const options = ['Email', 'SMS', 'Push']
</script>
