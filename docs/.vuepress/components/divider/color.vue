<template>
  <div class="center">
    <s-divider>Neutral</s-divider>
    <s-divider color="primary">Primary</s-divider>
    <s-divider color="success">Success</s-divider>
    <s-divider color="warning">Warning</s-divider>
    <s-divider color="danger">Danger</s-divider>
    <s-divider color="#8756d8">Custom HEX</s-divider>
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
