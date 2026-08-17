<template>
  <s-tabs v-model="active">
    <s-tab label="Inbox" icon="cb:email">Inbox</s-tab>
    <s-tab label="Settings" icon="cb:settings">Settings</s-tab>
  </s-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const active = ref(0)
</script>
