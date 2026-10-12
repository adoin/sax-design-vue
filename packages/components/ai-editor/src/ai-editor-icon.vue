<script setup lang="ts">
import AgentIcon from './agent-shared/agent-icon.vue'
defineProps<{ src?: string; busy: boolean }>()
</script>
<template>
  <AgentIcon :src="src" :busy="busy">
    <template v-if="$slots.default" #default><slot /></template>
  </AgentIcon>
</template>
