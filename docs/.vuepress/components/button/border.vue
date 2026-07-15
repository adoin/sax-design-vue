<template>
  <div class="center">
    <s-button type="border" :active="active == 0" @click="active = 0">
      Active
    </s-button>
    <s-button type="border" :active="active == 1" @click="active = 1">
      Default
    </s-button>
    <s-button type="border" disabled> Disabled </s-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref<number>(0)
</script>

<style lang="scss">
* {
  box-sizing: border-box !important;
}
</style>

<style lang="scss" scoped>
.center {
  max-width: 400px;
  margin: auto;
}
</style>
