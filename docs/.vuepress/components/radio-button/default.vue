<template>
  <div>
    <s-radio-button
      v-for="item in options"
      :key="item"
      v-model="value"
      name="size"
      :value="item"
      >{{ item }}</s-radio-button
    >
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const value = ref('Medium')
const options = ['Small', 'Medium', 'Large']
</script>
