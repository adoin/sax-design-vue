<template>
  <div class="center con-checkbox">
    <s-checkbox-group v-model="options">
      <s-checkbox value="css"> Css </s-checkbox>
      <s-checkbox color="danger" value="html"> Html </s-checkbox>
      <s-checkbox color="warn" value="javascript"> Javascript </s-checkbox>
      <s-checkbox color="#42b883" value="vue"> Vue </s-checkbox>
      <s-checkbox color="dark" value="vuesax"> Vuesax </s-checkbox>
    </s-checkbox-group>

    <span class="data-check">
      {{ options }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const options = ref(['javascript', 'vue'])
</script>

<style scoped lang="scss">
.con-checkbox {
  flex-direction: column;
  align-items: flex-start;
  .s-checkbox {
    min-width: 80px;
  }
  .data-check {
    background: rgba(0, 0, 0, 0.03);
    padding: 10px 20px;
    border-radius: 18px;
    margin-top: 20px;
  }
}
</style>
