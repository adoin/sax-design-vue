<template>
  <div class="center">
    <s-tooltip shape="circle">
      <s-button shape="circle" type="flat"> Do hover here </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
  </div>
</template>

<style scoped lang="scss">
.vs-button {
  margin: 0px;
}
</style>
