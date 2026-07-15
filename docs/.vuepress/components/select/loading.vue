<template>
  <div class="center con-selects">
    <s-select v-model="value1" placeholder="Success" loading>
      <s-option label="Vuesax" value="1"> Vuesax </s-option>
      <s-option label="Vue" value="2"> Vue </s-option>
      <s-option label="Javascript" value="3"> Javascript </s-option>
      <s-option label="Sass" value="4"> Sass </s-option>
      <s-option label="Typescript" value="5"> Typescript </s-option>
      <s-option label="Webpack" value="6"> Webpack </s-option>
      <s-option label="Nodejs" value="7"> Nodejs </s-option>
    </s-select>

    <s-select v-model="value2" placeholder="Warn" loading multiple>
      <s-option label="Vuesax" value="1"> Vuesax </s-option>
      <s-option label="Vue" value="2"> Vue </s-option>
      <s-option label="Javascript" value="3"> Javascript </s-option>
      <s-option label="Sass" value="4"> Sass </s-option>
      <s-option label="Typescript" value="5"> Typescript </s-option>
      <s-option label="Webpack" value="6"> Webpack </s-option>
      <s-option label="Nodejs" value="7"> Nodejs </s-option>
    </s-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref('3')
const value2 = ref(['4', '1', '3'])
</script>

<style scoped lang="scss">
.con-selects {
  align-items: flex-start;
  .s-select-content {
    margin: 10px;
    max-width: 40%;
  }
}

@media (max-width: 500px) {
  .con-selects {
    .s-select-content {
      max-width: 100%;
    }
  }
}
</style>
