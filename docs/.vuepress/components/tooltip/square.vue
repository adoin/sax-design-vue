<template>
  <div class="center">
    <s-tooltip shape="square">
      <s-button shape="square" type="flat"> Do hover here </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
  </div>
</template>

<style scoped lang="scss">
.s-button {
  margin: 0px;
}
</style>
