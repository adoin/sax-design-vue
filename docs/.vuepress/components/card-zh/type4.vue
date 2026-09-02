<template>
  <div class="center">
    <s-card type="frosted">
      <template #title>
        <h3>艺术画作</h3>
      </template>
      <template #img>
        <img src="/foto2.jpg" alt="毛玻璃说明卡片" />
      </template>
      <template #text>
        <p>文字面板覆盖在图片底部，悬停时向上展开。</p>
      </template>
      <template #interactions>
        <s-button color="danger" icon aria-label="收藏">
          <s-icon name="bx:heart" />
        </s-button>
        <s-button class="btn-chat" type="shadow" aria-label="54 条评论">
          <s-icon name="bx:chat" />
          <span class="span">54</span>
        </s-button>
      </template>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.btn-chat {
  i {
    font-size: 1.2rem;
  }

  .span {
    padding-left: 5px;
    font-weight: bold;
  }
}
</style>
