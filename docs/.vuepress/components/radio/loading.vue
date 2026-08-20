<script lang="ts" setup>
import { shallowRef } from 'vue'

const picked = shallowRef('1')
</script>

<template>
  <div class="center">
    <s-radio v-model="picked" loading value="1"> Option 1 </s-radio>
    <s-radio v-model="picked" loading value="2"> Option 2 </s-radio>
  </div>
</template>

<style scoped lang="scss">
.center {
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
}
</style>
