<template>
  <div class="center">
    <s-tooltip loading>
      <s-button type="flat"> Do hover here loading </s-button>
      <template #content> This is a beautiful button </template>
    </s-tooltip>
    <s-tooltip loading>
      <s-button type="flat"> Do hover here loading </s-button>
      <template #content />
    </s-tooltip>
  </div>
</template>
<style scoped lang="scss">
.s-button {
  margin: 0 5px;
}
</style>
