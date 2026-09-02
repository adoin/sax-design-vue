<template>
  <div class="center">
    <s-card
      type="classic"
      title="时尚穿搭"
      text="适合展示图片、简短描述和常用操作。"
    >
      <template #img>
        <img src="/foto5.png" alt="身穿夏日系列服装的模特" />
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
