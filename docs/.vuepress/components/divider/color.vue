<template>
  <div class="center">
    <s-divider>Default</s-divider>
    <s-divider color="primary">Primary</s-divider>
    <s-divider color="success">Success</s-divider>
    <s-divider color="danger">Danger</s-divider>
    <s-divider color="warning">Warning</s-divider>
    <s-divider color="dark">Dark</s-divider>
    <s-divider color="rgb(29, 222, 194)">RGB</s-divider>
    <s-divider color="#ad289f">HEX</s-divider>
  </div>
</template>

<style scoped lang="scss">
.center {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
