<template>
  <div class="center con-selects">
    <s-select v-model="value1" label="Label">
      <s-option label="Vuesax" value="1"> Vuesax </s-option>
      <s-option label="Vue" value="2"> Vue </s-option>
      <s-option label="Javascript" value="3"> Javascript </s-option>
      <s-option label="Sass" value="4"> Sass </s-option>
      <s-option label="Typescript" value="5"> Typescript </s-option>
      <s-option label="Webpack" value="6"> Webpack </s-option>
      <s-option label="Nodejs" value="7"> Nodejs </s-option>
    </s-select>

    <s-select v-model="value2" label="Label placeholder" label-float>
      <s-option label="Vuesax" value="1"> Vuesax </s-option>
      <s-option label="Vue" value="2"> Vue </s-option>
      <s-option label="Javascript" value="3"> Javascript </s-option>
      <s-option label="Sass" value="4"> Sass </s-option>
      <s-option label="Typescript" value="5"> Typescript </s-option>
      <s-option label="Webpack" value="6"> Webpack </s-option>
      <s-option label="Nodejs" value="7"> Nodejs </s-option>
    </s-select>

    <s-select v-model="value3" placeholder="Placeholder">
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

const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
</script>
