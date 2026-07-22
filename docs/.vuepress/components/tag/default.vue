<template>
  <div class="tag-demo">
    <s-tag>Primary</s-tag>
    <s-tag status="success" round>Success</s-tag>
    <s-tag type="warning">Warning</s-tag>
    <s-tag type="danger" closable @close="onClose">Removable</s-tag>
  </div>
</template>

<script lang="ts" setup>
const onClose = () => undefined
</script>

<style scoped>
.tag-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
