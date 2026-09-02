<template>
  <div class="center">
    <s-card
      type="article"
      title="Designing interfaces that feel inevitable"
      subtitle="Design systems · 8 min read"
      text="A practical guide to reducing visual noise while keeping every action easy to find."
    >
      <template #media>
        <img src="/foto4.png" alt="Abstract editorial artwork" />
      </template>

      <div class="article-author">
        <s-avatar size="32">
          <img src="/avatars/avatar-7.png" alt="" />
        </s-avatar>
        <span><strong>Alex Morgan</strong>Published August 28</span>
      </div>

      <template #actions>
        <s-button type="flat">Read article</s-button>
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
