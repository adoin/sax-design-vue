<template>
  <div class="center con-avatars">
    <s-avatar-group max="7">
      <s-avatar>
        <img src="/avatars/avatar-1.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-6.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-2.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-7.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-3.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-8.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-4.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-9.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-5.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-10.png" alt="" />
      </s-avatar>
    </s-avatar-group>

    <s-avatar-group float max="8">
      <s-avatar>
        <img src="/avatars/avatar-1.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-6.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-2.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-7.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-3.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-8.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-4.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-9.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-5.png" alt="" />
      </s-avatar>
      <s-avatar>
        <img src="/avatars/avatar-10.png" alt="" />
      </s-avatar>
    </s-avatar-group>
  </div>
</template>

<style scoped lang="scss">
.con-avatars {
  align-items: flex-start;
  .s-avatar__group {
    margin: 10px;
    &.float {
      max-width: 300px;
    }
  }
}

@media (max-width: 500px) {
  .con-avatars {
    align-items: flex-start;
    justify-content: flex-start;
    .s-avatar__group {
      margin: 10px;
      &.float {
        max-width: 100%;
      }
    }
  }
}
</style>
