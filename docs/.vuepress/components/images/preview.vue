<template>
  <s-images
    ><s-image
      src="https://picsum.photos/seed/preview/520/260"
      :preview-src-list="photos"
      preview
      fit="contain"
      width="260"
      height="150"
  /></s-images>
</template>
<script lang="ts" setup>
const photos = [
  'https://picsum.photos/seed/preview/900/600',
  'https://picsum.photos/seed/next/900/600',
]
</script>
