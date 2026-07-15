<template>
  <div class="center">
    <s-button>
      Home
      <template #animate>
        <i class="bx bx-home-alt" />
      </template>
    </s-button>

    <s-button type="flat" color="success" animation-type="vertical">
      Message
      <template #animate> <i class="bx bx-mail-send" /> Send </template>
    </s-button>

    <s-button
      type="gradient"
      style="min-width: 60px"
      color="warn"
      animation-type="scale"
    >
      <i class="bx bxs-shopping-bag" />
      <template #animate> Store </template>
    </s-button>

    <s-button icon type="relief" color="danger" animation-type="rotate">
      <i class="bx bx-like" />
      <template #animate>
        <i class="bx bxs-like" />
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
