<template>
  <s-anchor v-model="active" :items="items" direction="horizontal" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('#overview')
const items = [
  { href: '#overview', title: 'Overview' },
  { href: '#usage', title: 'Usage' },
  { href: '#api', title: 'API' },
]
</script>
