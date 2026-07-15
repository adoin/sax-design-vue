<template>
  <div class="center con-avatars">
    <s-avatar size="30">
      <template #text> Lily </template>
    </s-avatar>
    <s-avatar size="40" color="text">
      <template #text> Evan You </template>
    </s-avatar>
    <s-avatar color="success">
      <i class="bx bx-user" />
    </s-avatar>
    <s-avatar size="60" color="primary" badge badge-color="danger">
      <i class="bx bxs-hot" />
    </s-avatar>
    <s-avatar size="70" badge badge-color="success">
      <img src="/avatars/avatar-4.png" alt="" />
    </s-avatar>
  </div>
</template>
<style scoped lang="scss">
.con-avatars {
  .vs-avatar-content {
    margin: 10px;
  }
}
</style>
