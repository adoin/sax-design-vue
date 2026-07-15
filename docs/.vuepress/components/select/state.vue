<template>
  <div class="center con-selects">
    <s-select
      v-for="(color, index) in colors"
      :key="index"
      v-model="color.value"
      :state="color.color"
      :label="color.color"
      placeholder="Select"
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
import type { Color } from 'sax-design-vue'

const colors: { color: Color; value: string }[] = [
  {
    color: 'primary',
    value: '1',
  },
  {
    color: 'danger',
    value: '1',
  },
  {
    color: 'success',
    value: '2',
  },
  {
    color: 'warn',
    value: '3',
  },
  {
    color: 'dark',
    value: '4',
  },
]
</script>

<style scoped lang="scss">
.con-selects {
  .vs-select {
    margin: 10px;
  }
}
</style>
