<template>
  <div class="center con-selects">
    <s-select v-model="value" label="Sax Design color" label-float color="danger">
      <s-option label="Sax Design" value="1"> Sax Design </s-option>
      <s-option label="Vue" value="2"> Vue </s-option>
      <s-option label="Javascript" value="3"> Javascript </s-option>
      <s-option label="Sass" value="4"> Sass </s-option>
      <s-option label="Typescript" value="5"> Typescript </s-option>
      <s-option label="Webpack" value="6"> Webpack </s-option>
      <s-option label="Nodejs" value="7"> Nodejs </s-option>
    </s-select>

    <s-select v-model="value" label="Custom color" label-float color="#7d33ff">
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

const value = ref()
</script>
