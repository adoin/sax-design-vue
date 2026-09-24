<template>
  <div class="effect-demo effect-demo--ambient">
    <s-card effect="spotlight" title="聚光边框" color="primary">
      <p>在卡片上移动指针，局部单色高光会沿边框跟随当前位置。</p>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.effect-demo {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 36px;
  border-radius: var(--sax-radius-xl);
}

.effect-demo--ambient {
  background:
    radial-gradient(circle at 18% 20%, rgb(126 112 255 / 24%), transparent 34%),
    hsl(var(--sax-background));
}
</style>
