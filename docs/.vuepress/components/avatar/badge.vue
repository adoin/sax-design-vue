<template>
  <div class="center con-avatars">
    <s-avatar badge>
      <img src="/avatars/avatar-5.png" alt="" />
    </s-avatar>
    <s-avatar badge badge-color="danger">
      <img src="/avatars/avatar-6.png" alt="" />
    </s-avatar>
    <s-avatar badge badge-color="success">
      <img src="/avatars/avatar-2.png" alt="" />
      <template #badge> 28 </template>
    </s-avatar>
    <s-avatar badge badge-color="warn">
      <img src="/avatars/avatar-8.png" alt="" />
      <template #badge>
        <i class="bx bxs-bell-off" />
      </template>
    </s-avatar>
    <s-avatar badge badge-color="danger">
      <img src="/avatars/avatar-9.png" alt="" />
      <template #badge> Off </template>
    </s-avatar>
    <s-avatar writing badge badge-color="primary">
      <img src="/avatars/avatar-3.png" alt="" />
    </s-avatar>
    <s-avatar badge-position="top-right" badge badge-color="#7d33ff">
      <img src="/avatars/avatar-1.png" alt="" />
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
