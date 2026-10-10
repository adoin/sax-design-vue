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
          d="M10 3.5 12.2 9.8 18.5 12l-6.3 2.2L10 20.5l-2.2-6.3L1.5 12l6.3-2.2L10 3.5Z"
          fill="currentColor"
        />
        <path
          d="m19 2 .9 2.6 2.6.9-2.6.9L19 9l-.9-2.6-2.6-.9 2.6-.9L19 2Z"
          fill="currentColor"
          opacity=".6"
        />
      </svg>
    </slot>
  </span>
</template>
