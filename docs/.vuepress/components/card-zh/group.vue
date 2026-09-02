<template>
  <div class="center">
    <s-card-group>
      <s-card v-for="card in 6" :key="card">
        <template #title>
          <h3>绿植盆栽</h3>
        </template>
        <template #media>
          <img :src="`/foto${card}.png`" alt="绿植盆栽卡片" />
        </template>
        <template #text>
          <p>适合放置简短描述、媒体内容和常用操作。</p>
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
    </s-card-group>
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
