<template>
  <div class="chip-round">
    <s-chip color="primary" round>Primary</s-chip>
    <s-chip color="success" tag-style="outline" round>Outline</s-chip>
    <s-chip color="warning" tag-style="mark" round>Marked</s-chip>
    <s-chip color="primary" tag-style="arrow" round>Forward</s-chip>
  </div>
</template>

<style scoped>
.chip-round {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
