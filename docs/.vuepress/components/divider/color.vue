<template>
  <div class="center">
    <vs-divider>Default</vs-divider>
    <vs-divider color="primary">Primary</vs-divider>
    <vs-divider color="success">Success</vs-divider>
    <vs-divider color="danger">Danger</vs-divider>
    <vs-divider color="warning">Warning</vs-divider>
    <vs-divider color="dark">Dark</vs-divider>
    <vs-divider color="rgb(29, 222, 194)">RGB</vs-divider>
    <vs-divider color="#ad289f">HEX</vs-divider>
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
