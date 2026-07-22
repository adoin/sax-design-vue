<template>
  <s-countdown :value="deadline" format="mm:ss" @finish="finished = true" />
  <span v-if="finished">Finished</span>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const deadline = Date.now() + 5 * 60 * 1000
const finished = ref(false)
</script>
