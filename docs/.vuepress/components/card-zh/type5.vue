<template>
  <div class="center">
    <s-card type="reveal">
      <template #title>
        <h3>时光流沙</h3>
      </template>
      <template #img>
        <img src="/foto13.png" alt="居中浮现卡片" />
      </template>
      <template #text>
        <p>文字面板从图片下方浮现，适合强调视觉内容。</p>
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
