<template>
  <div class="center">
    <s-card type="overlay">
      <template #title>
        <h3>改变命运</h3>
      </template>
      <template #img>
        <img src="/foto6.png" alt="图片叠层卡片" />
      </template>
      <template #text>
        <p>文字覆盖在图片下方，并在悬停时完整显示。</p>
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
