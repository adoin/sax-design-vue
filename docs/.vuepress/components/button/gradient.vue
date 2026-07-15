<template>
  <div class="center">
    <s-button type="gradient" :active="active == 0" @click="active = 0">
      Active
    </s-button>
    <s-button type="gradient" :active="active == 1" @click="active = 1">
      Default
    </s-button>
    <s-button type="gradient" disabled> Disabled </s-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref<number>(0)
</script>
