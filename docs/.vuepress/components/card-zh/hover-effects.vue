<template>
  <div class="effect-grid">
    <s-card
      interactive
      hover-effect="none"
      variant="outlined"
      title="无效果"
      text="保持稳定，不添加装饰性位移。"
      aria-label="打开无悬停效果的卡片"
    />
    <s-card
      interactive
      hover-effect="lift"
      title="上浮"
      text="鼠标悬停或键盘聚焦时抬高卡片。"
      aria-label="打开带上浮效果的卡片"
    />
    <s-card
      interactive
      hover-effect="glow"
      variant="outlined"
      color="success"
      title="光晕"
      text="使用语义色强调焦点与卡片边缘。"
      aria-label="打开带光晕效果的卡片"
    />
  </div>
</template>

<style lang="scss" scoped>
.effect-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 16px;
  width: 100%;
  padding: 12px;
}
</style>
