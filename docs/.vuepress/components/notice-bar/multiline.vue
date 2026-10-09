<script setup lang="ts">
const message =
  'This longer notice contains several important details. Allow wrapping when the full message should remain visible at once; use a stationary single line when a compact announcement is preferred.'
</script>

<template>
  <div class="notice-demo">
    <s-notice-bar wrapable :content="message" /><s-notice-bar
      :scrollable="false"
      :content="message"
    />
  </div>
</template>

<style scoped>
.notice-demo {
  display: grid;
  align-items: start;
  justify-items: start;
  gap: 16px;
  width: 100%;
}
.notice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
}
.notice-grid p {
  margin: 0 0 12px;
}
</style>
