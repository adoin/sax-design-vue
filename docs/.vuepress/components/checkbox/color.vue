<template>
  <div class="center">
    <s-checkbox v-model="option1"> Primary </s-checkbox>
    <s-checkbox v-model="option2" color="success"> Success </s-checkbox>
    <s-checkbox v-model="option3" color="danger"> Danger </s-checkbox>
    <s-checkbox v-model="option4" color="warn"> warning </s-checkbox>
    <s-checkbox v-model="option5" color="dark"> dark </s-checkbox>
    <s-checkbox v-model="option6" color="#7d33ff"> HEX </s-checkbox>
    <s-checkbox v-model="option7" color="rgb(59,222,200)"> RGB </s-checkbox>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const option1 = ref<boolean>(true)
const option2 = ref<boolean>(true)
const option3 = ref<boolean>(true)
const option4 = ref<boolean>(true)
const option5 = ref<boolean>(true)
const option6 = ref<boolean>(true)
const option7 = ref<boolean>(true)
</script>
