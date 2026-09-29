<template>
  <div class="center con-selects">
    <s-select
      v-model="value1"
      label="Group"
      placeholder="Group"
      :option-groups="groups"
    />

    <s-select
      v-model="value2"
      label="Group Filter"
      filter
      placeholder="Filter"
      :option-groups="groups"
    />

    <s-select
      v-model="value3"
      label="Group Multiple Filter"
      filter
      multiple
      placeholder="Group Multiple Filter"
      :option-groups="groups"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref('3')
const value2 = ref('4')
const value3 = ref(['1'])
const groups = [
  {
    label: 'Vuejs',
    options: [
      { label: 'Sax Design', value: '1' },
      { label: 'Vue', value: '2' },
      { label: 'Javascript', value: '3' },
    ],
  },
  {
    label: 'Others',
    options: [
      { label: 'Sass', value: '4' },
      { label: 'Typescript', value: '5' },
      { label: 'Webpack', value: '6' },
      { label: 'Nodejs', value: '7' },
    ],
  },
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
