<script lang="ts" setup>
import { shallowRef } from 'vue'

const deadline = Date.now() + 5 * 60 * 1000
const finished = shallowRef(false)
</script>

<template>
  <s-countdown :value="deadline" format="mm:ss" @finish="finished = true" />
  <span v-if="finished">Finished</span>
</template>
