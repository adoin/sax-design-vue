<template>
  <div class="con-selects">
    <s-select
      v-model="value"
      label="Multiple"
      block
      multiple
      danger
      placeholder="Filter"
    >
      <s-option label="Sax Design" value="1"> Sax Design </s-option>
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
      block
      filter
      multiple
      placeholder="Filter Multiple"
    >
      <s-option label="Sax Design" value="1"> Sax Design </s-option>
      <s-option label="Vue" value="2"> Vue </s-option>
      <s-option label="Javascript" value="3"> Javascript </s-option>
      <s-option label="Sass" value="4"> Sass </s-option>
      <s-option label="Typescript" value="5"> Typescript </s-option>
      <s-option label="Webpack" value="6"> Webpack </s-option>
      <s-option label="Nodejs" value="7"> Nodejs </s-option>
    </s-select>

    <s-select
      v-model="value3"
      label="Adaptive collapsed tags"
      block
      filter
      multiple
      collapse-tags
      placeholder="Resize to see tags adapt"
    >
      <s-option label="Sax Design" value="1"> Sax Design </s-option>
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
const value3 = ref(['1', '2', '3', '4', '5', '6', '7'])
</script>

<style scoped lang="scss">
.con-selects {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: start;
  gap: 32px 24px;
  width: 100%;
}
</style>
