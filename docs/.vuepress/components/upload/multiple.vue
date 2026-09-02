<template>
  <s-upload
    multiple
    mode="image"
    list-type="card"
    preview-fit="contain"
    text="Add images"
    :limit="6"
    :limit-size="3"
    :upload-method="uploadMethod"
  />
</template>

<script setup lang="ts">
const uploadMethod = async () => ({ ok: true })
</script>
