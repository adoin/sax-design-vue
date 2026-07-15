<template>
  <div class="center con-switch">
    <s-switch v-model="active1" />
    <s-switch v-model="active2" color="success" />
    <s-switch v-model="active3" color="danger" />
    <s-switch v-model="active4" color="warn" />
    <s-switch v-model="active5" color="dark" />
    <s-switch v-model="active6" color="#7d33ff" />
    <s-switch v-model="active7" color="rgb(59,222,200)" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active1 = ref(true)
const active2 = ref(true)
const active3 = ref(true)
const active4 = ref(true)
const active5 = ref(true)
const active6 = ref(true)
const active7 = ref(true)
</script>

<style lang="scss" scoped>
.con-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  .vs-switch {
    margin: 10px;
  }
}
</style>
