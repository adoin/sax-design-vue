<template>
  <div class="center">
    <s-tooltip>
      <s-button type="shadow"> Default </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip color="primary">
      <s-button type="flat"> Primary </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip color="success">
      <s-button color="success" type="flat"> Success </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip color="danger">
      <s-button color="danger" type="flat"> Danger </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip color="warn">
      <s-button color="warn" type="flat"> Warning </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip color="dark">
      <s-button color="dark" type="flat"> Dark </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip color="#7d33ff">
      <s-button color="#7d33ff" type="flat"> HEX </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip color="rgb(59,222,200)">
      <s-button color="rgb(59,222,200)" type="flat"> RGB </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
  </div>
</template>

<style scoped lang="scss">
.s-button {
  margin: 0 5px;
}
</style>
