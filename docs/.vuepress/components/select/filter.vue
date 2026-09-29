<template>
  <div class="center con-selects">
    <s-select
      v-model="value"
      placeholder="Filter with default first matched"
      filter
      default-first-option
      :options="options"
    />
    <s-select
      v-model="value2"
      filter
      multiple
      placeholder="Filter Multiple"
      :options="options"
    />
    <s-select
      v-model="value3"
      placeholder="Filter with allow create"
      filter
      allow-create
      :options="options2"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const value2 = ref<string[]>([])
const value3 = ref('')
const options = [
  { label: 'Sax Design', value: '1' },
  { label: 'Vue', value: '2' },
  { label: 'Javascript', value: '3' },
  { label: 'Sass', value: '4' },
  { label: 'Typescript', value: '5' },
  { label: 'Webpack', value: '6' },
  { label: 'Nodejs', value: '7' },
]

const options2 = [
  { label: 'Sax Design', value: '1' },
  { label: 'Vue', value: '2' },
  { label: 'Javascript', value: '3' },
  { label: 'Sass', value: '4', disabled: true },
  { label: 'Typescript', value: '5' },
  { label: 'Webpack', value: '6' },
  { label: 'Nodejs', value: '7' },
]
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
