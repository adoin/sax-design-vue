<template>
  <div class="center con-avatars">
    <s-avatar>
      <template #text> Lily </template>
    </s-avatar>
    <s-avatar>
      <template #text> Evan You </template>
    </s-avatar>
    <s-avatar>
      <i class="bx bx-user" />
    </s-avatar>
    <s-avatar color="primary">
      <i class="bx bxs-hot" />
    </s-avatar>
    <s-avatar>
      <img src="/avatars/avatar-5.png" alt="" />
    </s-avatar>
  </div>
</template>

<style scoped lang="scss">
.con-avatars {
  .s-avatar-content {
    margin: 10px;
  }
}
</style>
