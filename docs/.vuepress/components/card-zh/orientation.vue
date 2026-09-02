<template>
  <div class="orientation-grid">
    <s-card
      orientation="vertical"
      variant="outlined"
      title="纵向排列"
      subtitle="媒体位于内容上方"
      text="适合画廊、商品和文章摘要等场景。"
    >
      <template #media>
        <img src="/foto2.jpg" alt="暖色调的抽象艺术作品" />
      </template>
    </s-card>

    <s-card
      orientation="horizontal"
      variant="soft"
      color="success"
      title="横向排列"
      subtitle="媒体位于内容侧面"
      text="在窄屏下会自动恢复为纵向排列。"
    >
      <template #media>
        <img src="/foto1.png" alt="横向卡片使用的人像照片" />
      </template>
      <template #actions>
        <s-button color="success" type="flat">查看详情</s-button>
      </template>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.orientation-grid {
  display: grid;
  gap: 20px;
  width: 100%;
  padding: 12px;
}
</style>
