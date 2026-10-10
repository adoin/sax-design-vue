<script setup lang="ts">
defineProps<{ src?: string; busy: boolean }>()
</script>

<template>
  <span
    class="s-ai-editor__ai-icon"
    :class="{ 'is-busy': busy }"
    aria-hidden="true"
  >
    <slot>
      <img v-if="src" :src="src" alt="" draggable="false" />
      <svg v-else viewBox="0 0 24 24" fill="none" focusable="false">
        <path
          d="M10 4c.9 4.6 2.4 6.1 7 7-4.6.9-6.1 2.4-7 7-.9-4.6-2.4-6.1-7-7 4.6-.9 6.1-2.4 7-7Z"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linejoin="round"
        />
        <path
          d="M19 3v4m-2-2h4M19 16v4m-2-2h4"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        />
      </svg>
    </slot>
  </span>
</template>
