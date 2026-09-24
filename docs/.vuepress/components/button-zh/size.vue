<script setup lang="ts">
import { shallowRef } from 'vue'

const active = shallowRef(0)
</script>

<template>
  <div class="center">
    <s-button size="xl" :active="active === 0" @click="active = 0"
      >超大</s-button
    >
    <s-button size="large" :active="active === 1" @click="active = 1"
      >大号</s-button
    >
    <s-button :active="active === 2" @click="active = 2">默认</s-button>
    <s-button size="small" :active="active === 3" @click="active = 3"
      >小号</s-button
    >
    <s-button size="mini" :active="active === 4" @click="active = 4"
      >迷你</s-button
    >
  </div>
</template>
