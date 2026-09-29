<script setup lang="ts">
import { useId } from '@vuesax-alpha/hooks'
import { filledStarPath } from '../../icon/src/star-filled-path'
defineProps<{ percentage: number; color: string; voidColor: string }>()
const gradientId = useId()
</script>

<template>
  <svg viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient
        :id="gradientId"
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1="0"
        x2="1024"
        y2="0"
      >
        <stop :offset="`${percentage}%`" :stop-color="color" />
        <stop :offset="`${percentage}%`" :stop-color="voidColor" />
      </linearGradient>
    </defs>
    <path :d="filledStarPath" :fill="`url(#${gradientId})`" />
  </svg>
</template>
