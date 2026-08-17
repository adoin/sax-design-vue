<template>
  <div class="center">
    <s-button>
      Home
      <template #animate>
        <s-icon  name="bx:home-alt" />
      </template>
    </s-button>

    <s-button type="flat" color="success" animation-type="vertical">
      Message
      <template #animate> <s-icon  name="bx:mail-send" /> Send </template>
    </s-button>

    <s-button
      type="gradient"
      style="min-width: 60px"
      color="warn"
      animation-type="scale"
    >
      <s-icon  name="bxs:shopping-bag" />
      <template #animate> Store </template>
    </s-button>

    <s-button icon type="relief" color="danger" animation-type="rotate">
      <s-icon  name="bx:like" />
      <template #animate>
        <s-icon  name="bxs:like" />
      </template>
    </s-button>
  </div>
</template>

<style lang="scss" scoped>
.center {
  max-width: 400px;
  margin: auto;
}
</style>
