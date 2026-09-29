<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
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
</script>

<template>
  <div class="center con-selects">
    <s-select v-model="value1" label="Label" :options="options" />

    <s-select
      v-model="value2"
      label="Floating label"
      label-float
      :options="options"
    />

    <s-select v-model="value3" placeholder="Placeholder" :options="options" />
  </div>
</template>

<style scoped>
.con-selects {
  align-items: flex-end;
}
</style>
