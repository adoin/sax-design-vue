<template>
  <div class="center con-selects">
    <s-select
      v-model="value"
      label="Sax Design color"
      label-float
      color="danger"
      :options="options"
    />

    <s-select
      v-model="value"
      label="Custom color"
      label-float
      color="#7d33ff"
      :options="options"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref()
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
