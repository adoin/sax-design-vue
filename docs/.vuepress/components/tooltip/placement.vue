<template>
  <div class="center">
    <s-tooltip placement="left">
      <s-button type="border"> left </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip placement="top">
      <s-button type="border"> Top </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip placement="bottom">
      <s-button type="border"> Bottom </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip placement="right">
      <s-button type="border"> right </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
  </div>
</template>

<style scoped lang="scss">
.s-button {
  margin: 0 5px;
}
</style>
