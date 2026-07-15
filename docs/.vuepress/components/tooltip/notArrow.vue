<template>
  <div class="center">
    <s-tooltip :show-arrow="false" placement="left">
      <s-button type="border"> left not-arrow </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip :show-arrow="false">
      <s-button type="border"> Top not-arrow </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip :show-arrow="false" placement="bottom">
      <s-button type="border"> Bottom not-arrow </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip :show-arrow="false" placement="right">
      <s-button type="border"> right not-arrow </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
  </div>
</template>
<style scoped lang="scss">
.vs-button {
  margin: 0 5px;
}
</style>
