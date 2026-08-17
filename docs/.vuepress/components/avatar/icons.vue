<template>
  <div class="center con-avatars">
    <s-avatar>
      <img src="/avatars/avatar-1.png" alt="" />
      <template #icons>
        <s-icon  name="bxl:facebook-square" />
        <s-icon  name="bxl:github" />
        <s-icon  name="bxl:twitter" />
      </template>
    </s-avatar>
    <s-avatar badge badge-color="danger" badge-position="bottom-left">
      <img src="/avatars/avatar-8.png" alt="" />
      <template #icons>
        <s-icon  name="bxl:twitch" />
        <s-icon  name="bxl:discord" />
      </template>
    </s-avatar>
    <s-avatar loading badge badge-color="success" badge-position="top-left">
      <img src="/avatars/avatar-2.png" alt="" />
      <template #icons>
        <s-icon  name="bxl:patreon" />
        <s-icon  name="bxl:linkedin-square" />
        <s-icon  name="bx:link" />
      </template>
    </s-avatar>
  </div>
</template>

<style scoped lang="scss">
.con-avatars {
  .s-avatar-content {
    margin: 20px;
  }
}
</style>
