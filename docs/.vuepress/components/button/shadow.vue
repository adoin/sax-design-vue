<template>
  <div class="center">
    <s-button type="shadow" :active="active == 0" @click="active = 0">
      Active
    </s-button>
    <s-button type="shadow" :active="active == 1" @click="active = 1">
      Default
    </s-button>
    <s-button type="shadow" disabled> Disabled </s-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref<number>(0)
</script>
