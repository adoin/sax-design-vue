<template>
  <div class="center con-selects">
    <s-select v-model="value1" placeholder="Success" :options="options">
      <template #message-success> Option Valid </template>
    </s-select>

    <s-select v-model="value2" placeholder="Warn" :options="options">
      <template #message-danger> Required </template>
    </s-select>

    <s-select v-model="value3" placeholder="Danger" :options="options">
      <template #message-warn>
        Select your country where you are currently
      </template>
    </s-select>
  </div>
</template>
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

<style scoped lang="scss">
.con-selects {
  align-items: flex-start;
  .s-select-content {
    margin: 10px;
  }
}
</style>
