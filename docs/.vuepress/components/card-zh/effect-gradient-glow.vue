<template>
  <div class="effect-demo effect-demo--ambient">
    <s-card effect="gradient-glow" title="渐变光晕" color="success">
      <p>多色边缘光弧跟随指针旋转，同时用克制的内部微光保证内容清晰。</p>
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
    radial-gradient(circle at 22% 24%, rgb(35 190 165 / 24%), transparent 36%),
    hsl(var(--sax-background));
}
</style>
