<template>
  <div class="center">
    <s-card
      type="profile"
      title="陈玛雅"
      subtitle="产品设计师"
      text="为创意团队设计克制、易用且无障碍的工具。"
    >
      <template #media>
        <img src="/avatars/avatar-4.png" alt="陈玛雅的头像" />
      </template>

      <div class="profile-stats" aria-label="个人数据">
        <span><strong>128</strong> 个项目</span>
        <span><strong>8.4k</strong> 关注者</span>
        <span><strong>96%</strong> 好评率</span>
      </div>

      <template #actions>
        <s-button color="primary">查看资料</s-button>
        <s-button type="flat">发消息</s-button>
      </template>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  span {
    display: grid;
    gap: 2px;
    color: hsl(var(--sax-text) / 0.62);
    font-size: 0.72rem;
  }

  strong {
    color: hsl(var(--sax-text));
    font-size: 1rem;
  }
}
</style>
