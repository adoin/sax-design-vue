<template>
  <div class="chip-styles">
    <s-chip color="primary">Default</s-chip>
    <s-chip color="success" tag-style="outline">Outline</s-chip>
    <s-chip color="danger" tag-style="dashed">Dashed</s-chip>
    <s-chip color="warning" tag-style="mark">Mark</s-chip>
    <s-chip color="primary" tag-style="arrow">Arrow</s-chip>
    <s-chip color="dark" tag-style="flag">Flag</s-chip>
  </div>
</template>

<style scoped lang="scss">
.chip-styles {
  display: flex;
  width: 100%;
  max-width: 620px;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
