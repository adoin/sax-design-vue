<template>
  <div class="center">
    <s-button @click="active = !active">
      {{ active ? 'Close Alert' : 'Open Alert' }}
    </s-button>

    <s-alert v-model="active" closeable>
      <template #title> Sax Design Vue </template>
      Sax Design Vue is a <b>Vue 3 component library</b> with expressive
      visuals, practical APIs, and consistent interaction patterns for product
      interfaces.
    </s-alert>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref<boolean>(true)
</script>

<style scoped>
.s-button {
  margin-bottom: 4px;
}
</style>
