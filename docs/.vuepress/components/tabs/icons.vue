<template>
  <s-tabs v-model="active">
    <s-tab label="Inbox" icon="inbox">Inbox</s-tab>
    <s-tab label="Settings" icon="settings">Settings</s-tab>
  </s-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>
