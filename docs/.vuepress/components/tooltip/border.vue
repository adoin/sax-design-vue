<template>
  <div class="center">
    <s-tooltip type="border">
      <s-button type="transparent"> Do hover here </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip color="danger" type="border">
      <s-button color="danger" type="transparent"> Do hover here </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip color="#7d33ff" type="border-thick">
      <s-button color="#7d33ff" type="transparent"> Do hover here </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
  </div>
</template>

<style scoped lang="scss">
.s-button {
  margin: 0 5px;
}
</style>
