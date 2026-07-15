<template>
  <div class="center">
    <s-divider>Default</s-divider>
    <s-divider background="primary" color="#ade6d4">Primary</s-divider>
    <s-divider background="success" color="#0a540a">Success</s-divider>
    <s-divider background="danger" color="lightcoral">Danger</s-divider>
    <s-divider background="warning" color="grey">Warning</s-divider>
    <s-divider background="dark" color="lightgrey">Dark</s-divider>
    <s-divider background="rgb(252, 243, 192)" color="rgb(29, 222, 194)"
      >RGB</s-divider
    >
    <s-divider background="#fffaaa" color="#ad289f">HEX</s-divider>
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
