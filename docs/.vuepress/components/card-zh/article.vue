<template>
  <div class="center">
    <s-card
      type="article"
      title="让界面自然得像本该如此"
      subtitle="设计系统 · 阅读 8 分钟"
      text="这是一份降低视觉噪声、同时让每个操作都容易找到的实践指南。"
    >
      <template #media>
        <img src="/foto4.png" alt="抽象风格的文章配图" />
      </template>

      <div class="article-author">
        <s-avatar size="32">
          <img src="/avatars/avatar-7.png" alt="" />
        </s-avatar>
        <span><strong>Alex Morgan</strong>发布于 8 月 28 日</span>
      </div>

      <template #actions>
        <s-button type="flat">阅读文章</s-button>
      </template>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.article-author {
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    display: grid;
    color: hsl(var(--sax-text) / 0.56);
    font-size: 0.72rem;
  }

  strong {
    color: hsl(var(--sax-text));
    font-size: 0.8rem;
  }
}
</style>
