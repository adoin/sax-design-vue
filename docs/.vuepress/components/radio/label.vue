<template>
  <div class="center">
    <s-radio v-model="picked" value="1"> Label </s-radio>
    <s-radio v-model="picked" label-before value="2"> label Before </s-radio>
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
  .vs-radio-wrapper {
    margin: 5px 0px;
  }
}
</style>
