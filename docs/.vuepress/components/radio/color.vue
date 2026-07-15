<template>
  <div class="center">
    <s-radio v-model="picked" value="1"> Primary </s-radio>
    <s-radio v-model="picked" value="2" color="success"> Success </s-radio>
    <s-radio v-model="picked" value="3" color="danger"> Danger </s-radio>
    <s-radio v-model="picked" value="4" color="warn"> Warning </s-radio>
    <s-radio v-model="picked" value="5" color="dark"> Dark </s-radio>
    <s-radio v-model="picked" value="6" color="#7d33ff"> HEX </s-radio>
    <s-radio v-model="picked" value="7" color="rgb(59,222,200)"> RGB </s-radio>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const picked = ref(2)
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
