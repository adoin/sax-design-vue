<template>
  <div class="center">
    <s-radio v-model="picked" value="1"> Option A </s-radio>
    <s-radio v-model="picked" value="2"> Option B </s-radio>
    <s-radio v-model="picked" value="3" disabled> Option C </s-radio>
    <s-radio v-model="picked" value="4"> Option D </s-radio>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const picked = ref(1)
</script>

<style scoped lang="scss">
.center {
  align-items: flex-start;
  flex-direction: column;
  .s-radio-wrapper {
    margin: 5px 0px;
  }
}
</style>
