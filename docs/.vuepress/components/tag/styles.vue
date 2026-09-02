<template>
  <div class="tag-styles">
    <s-tag color="primary">Default</s-tag>
    <s-tag color="success" variant="outline">Outline</s-tag>
    <s-tag color="danger" variant="dashed">Dashed</s-tag>
    <s-tag color="warning" variant="mark">Mark</s-tag>
    <s-tag color="primary" variant="arrow">Arrow</s-tag>
    <s-tag color="dark" variant="flag">Flag</s-tag>
  </div>
</template>

<style scoped lang="scss">
.tag-styles {
  display: flex;
  width: 100%;
  max-width: 620px;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
