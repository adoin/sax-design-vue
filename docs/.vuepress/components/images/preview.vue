<script setup lang="ts">
const photos = [
  'https://picsum.photos/seed/preview/900/600',
  'https://picsum.photos/seed/next/900/600',
]
</script>

<template>
  <s-images>
    <s-image
      src="https://picsum.photos/seed/preview/520/260"
      alt="Landscape photograph available in the preview gallery"
      :preview-src-list="photos"
      preview
      fit="contain"
      width="260"
      height="150"
    />
  </s-images>
</template>
