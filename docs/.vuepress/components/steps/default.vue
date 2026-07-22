<template>
  <s-steps :active="active" :items="items" @click="active = $event" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(1)
const items = [
  { title: 'Account', description: 'Create your account' },
  { title: 'Profile', description: 'Complete profile details' },
  { title: 'Done', description: 'Start using the workspace' },
]
</script>
