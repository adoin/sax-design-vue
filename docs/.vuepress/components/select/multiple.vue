<template>
  <div class="center con-selects">
    <s-select
      v-model="value"
      label="Multiple"
      multiple
      danger
      placeholder="Filter"
    >
      <s-option label="Vuesax" value="1"> Vuesax </s-option>
      <s-option label="Vue" value="2"> Vue </s-option>
      <s-option label="Javascript" value="3"> Javascript </s-option>
      <s-option label="Sass" value="4"> Sass </s-option>
      <s-option label="Typescript" value="5"> Typescript </s-option>
      <s-option label="Webpack" value="6"> Webpack </s-option>
      <s-option label="Nodejs" value="7"> Nodejs </s-option>
    </s-select>
    <s-select
      v-model="value2"
      label="Filter Multiple"
      filter
      multiple
      placeholder="Filter Multiple"
    >
      <s-option label="Vuesax" value="1"> Vuesax </s-option>
      <s-option label="Vue" value="2"> Vue </s-option>
      <s-option label="Javascript" value="3"> Javascript </s-option>
      <s-option label="Sass" value="4"> Sass </s-option>
      <s-option label="Typescript" value="5"> Typescript </s-option>
      <s-option label="Webpack" value="6"> Webpack </s-option>
      <s-option label="Nodejs" value="7"> Nodejs </s-option>
    </s-select>

    <s-select
      v-model="value3"
      label="Multiple collapse chips"
      filter
      multiple
      :multiple-limit="4"
      collapse-chips
      :max-collapse-chips="2"
      placeholder="Collapse chips"
    >
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

const value = ref(['1', '2', '3'])
const value2 = ref(['4'])
const value3 = ref(['1', '4', '5', '6'])
</script>

<style scoped lang="scss">
.con-selects {
  .vs-select-content {
    margin: 20px 10px;
    max-width: calc(40% - 20px);
  }
}

@media (max-width: 500px) {
  .con-selects {
    .vs-select-content {
      max-width: 100%;
    }
  }
}
</style>
