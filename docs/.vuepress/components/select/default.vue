<template>
  <div class="center con-selects">
    <s-select v-model="value" placeholder="Select">
      <s-option label="Vuesax" value="1"> Vuesax </s-option>
      <s-option label="Vue" value="2"> Vue </s-option>
      <s-option label="Javascript" value="3"> Javascript </s-option>
      <s-option disabled label="Sass" value="4"> Sass </s-option>
      <s-option label="Typescript" value="5"> Typescript </s-option>
      <s-option label="Webpack" value="6"> Webpack </s-option>
      <s-option label="Nodejs" value="7"> Nodejs </s-option>
    </s-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
</script>

<style lang="scss">
.con-selects {
  .vs-select {
    margin: 15px 10px;
    max-width: calc(40% - 20px);
  }
}

@media (max-width: 500px) {
  .con-selects {
    .vs-select {
      max-width: 100%;
    }
  }
}
</style>
