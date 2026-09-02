<template>
  <div class="center">
    <s-card
      type="classic"
      title="Trendy clothing"
      text="Lorem ipsum dolor sit amet consectetur, adipisicing elit."
    >
      <template #img>
        <img src="/foto5.png" alt="Model wearing the summer collection" />
      </template>
      <template #interactions>
        <s-button color="danger" icon aria-label="Favorite">
          <s-icon name="bx:heart" />
        </s-button>
        <s-button class="btn-chat" type="shadow" aria-label="54 comments">
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
