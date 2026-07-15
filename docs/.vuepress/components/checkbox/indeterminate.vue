<template>
  <div class="center">
    <s-checkbox v-model="option" indeterminate> Option </s-checkbox>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const option = ref(true)
</script>
