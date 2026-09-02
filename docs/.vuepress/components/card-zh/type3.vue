<template>
  <div class="center">
    <s-card type="split">
      <template #title>
        <h3>恣意生活</h3>
      </template>
      <template #img>
        <img src="/foto1.png" alt="横向分栏卡片" />
      </template>
      <template #text>
        <p>图片与文字横向排列，适合较宽的内容区域。</p>
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
