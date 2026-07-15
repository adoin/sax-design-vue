<template>
  <div class="center con-selects">
    <s-select v-model="value1" label="Group" placeholder="Group">
      <s-option-group label="Vuejs">
        <!-- PROP: label is required -->
        <s-option label="Vuesax" value="1"> Vuesax </s-option>
        <s-option label="Vue" value="2"> Vue </s-option>
        <s-option label="Javascript" value="3"> Javascript </s-option>
      </s-option-group>
      <s-option-group label="Others">
        <s-option label="Sass" value="4"> Sass </s-option>
        <s-option label="Typescript" value="5"> Typescript </s-option>
        <s-option label="Webpack" value="6"> Webpack </s-option>
        <s-option label="Nodejs" value="7"> Nodejs </s-option>
      </s-option-group>
    </s-select>

    <s-select v-model="value2" label="Group Filter" filter placeholder="Filter">
      <s-option-group label="Vuejs">
        <s-option label="Vuesax" value="1"> Vuesax </s-option>
        <s-option label="Vue" value="2"> Vue </s-option>
        <s-option label="Javascript" value="3"> Javascript </s-option>
      </s-option-group>
      <s-option-group label="Others">
        <s-option label="Sass" value="4"> Sass </s-option>
        <s-option label="Typescript" value="5"> Typescript </s-option>
        <s-option label="Webpack" value="6"> Webpack </s-option>
        <s-option label="Nodejs" value="7"> Nodejs </s-option>
      </s-option-group>
    </s-select>

    <s-select
      v-model="value3"
      label="Group Multiple Filter"
      filter
      multiple
      placeholder="Group Multiple Filter"
    >
      <s-option-group label="Vuejs">
        <s-option label="Vuesax" value="1"> Vuesax </s-option>
        <s-option label="Vue" value="2"> Vue </s-option>
        <s-option label="Javascript" value="3"> Javascript </s-option>
      </s-option-group>
      <s-option-group label="Others">
        <s-option label="Sass" value="4"> Sass </s-option>
        <s-option label="Typescript" value="5"> Typescript </s-option>
        <s-option label="Webpack" value="6"> Webpack </s-option>
        <s-option label="Nodejs" value="7"> Nodejs </s-option>
      </s-option-group>
    </s-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref(['3'])
const value2 = ref(['4'])
const value3 = ref(['1'])
</script>

<style scoped lang="scss">
.con-selects {
  .s-select-content {
    margin: 10px;
    max-width: calc(40% - 20px);
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
