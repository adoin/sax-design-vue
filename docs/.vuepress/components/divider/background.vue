<template>
  <div class="center">
    <vs-divider>Default</vs-divider>
    <vs-divider background="primary" color="#ade6d4">Primary</vs-divider>
    <vs-divider background="success" color="#0a540a">Success</vs-divider>
    <vs-divider background="danger" color="lightcoral">Danger</vs-divider>
    <vs-divider background="warning" color="grey">Warning</vs-divider>
    <vs-divider background="dark" color="lightgrey">Dark</vs-divider>
    <vs-divider background="rgb(252, 243, 192)" color="rgb(29, 222, 194)"
      >RGB</vs-divider
    >
    <vs-divider background="#fffaaa" color="#ad289f">HEX</vs-divider>
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
