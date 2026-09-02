<template>
  <div class="center con-selects">
    <s-select v-model="value" :options="options" placeholder="Select" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { label: 'Sax Design', value: '1' },
  { label: 'Vue', value: '2' },
  { label: 'JavaScript', value: '3' },
  { label: 'Sass', value: '4', disabled: true },
  { label: 'TypeScript', value: '5' },
]
</script>

<style scoped lang="scss">
.con-selects {
  .s-select {
    margin: 15px 10px;
    max-width: calc(40% - 20px);
  }
}

@media (max-width: 500px) {
  .con-selects {
    .s-select {
      max-width: 100%;
    }
  }
}
</style>
