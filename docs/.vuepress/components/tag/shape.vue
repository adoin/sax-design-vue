<template>
  <div class="tag-shapes">
    <s-tag color="primary">Rounded</s-tag>
    <s-tag color="success" shape="square">Square</s-tag>
    <s-tag color="warning" shape="pill">Pill</s-tag>
    <s-tag color="primary" variant="arrow" shape="pill">Forward</s-tag>
  </div>
</template>

<style scoped>
.tag-shapes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
