<template>
  <div class="center">
    <s-button flat @click="active = true">Open Alert 10s</s-button>
    <s-alert v-model="active" :progress="progress">
      <template #title> Sax Design Vue </template>
      Sax Design Vue is a <b>Vue 3 component library</b> with expressive
      visuals, practical APIs, and consistent interaction patterns for product
      interfaces.
    </s-alert>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const active = ref<boolean>(false)
const time = ref<number>(6000)
const progress = ref<number>(0)

watch(active, (val: boolean) => {
  if (val) {
    const interval = setInterval(() => {
      progress.value++
    }, time.value / 100)

    setTimeout(() => {
      active.value = false
      clearInterval(interval)
      progress.value = 0
    }, time.value)
  }
})
</script>
