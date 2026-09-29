<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
    <path
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      :d="filledStarPath"
    />
  </svg>
</template>
<script lang="ts" setup>
import { filledStarPath } from './star-filled-path'
defineOptions({ name: 'StarFilled' })
</script>
