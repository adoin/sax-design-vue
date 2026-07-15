<template>
  <div class="center con-avatars">
    <s-avatar shape="circle">
      <template #text> Joel </template>
    </s-avatar>
    <s-avatar shape="circle" color="danger">
      <template #text> Fanny </template>
    </s-avatar>
    <s-avatar shape="circle">
      <img src="/avatars/avatar-1.png" alt="" />
    </s-avatar>
    <s-avatar shape="circle" badge>
      <img src="/avatars/avatar-2.png" alt="" />
    </s-avatar>
    <s-avatar shape="circle" badge writing badge-color="success">
      <img src="/avatars/avatar-3.png" alt="" />
    </s-avatar>
    <s-avatar
      badge
      shape="circle"
      badge-color="warn"
      badge-position="top-right"
    >
      <img src="/avatars/avatar-5.png" alt="" />
    </s-avatar>
    <s-avatar history history-gradient shape="circle">
      <img src="/avatars/avatar-6.png" alt="" />
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
