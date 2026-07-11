<template>
  <vs-tabs v-model="active">
    <vs-tab label="Inbox" icon="inbox">Inbox</vs-tab>
    <vs-tab label="Settings" icon="settings">Settings</vs-tab>
  </vs-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>
