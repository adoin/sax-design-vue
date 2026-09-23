<template>
  <div class="divider-vertical-demo">
    <div class="divider-vertical-demo__row">
      <span>概览</span>
      <s-divider direction="vertical" />
      <span>动态</span>
      <s-divider direction="vertical" />
      <span>设置</span>
    </div>

    <div class="divider-vertical-demo__row">
      <s-link :underline="false">编辑</s-link>
      <s-divider direction="vertical" color="primary" />
      <s-link type="danger" :underline="false">删除</s-link>
    </div>

    <div class="divider-vertical-demo__row divider-vertical-demo__row--large">
      <span>18 px 文字</span>
      <s-divider direction="vertical" border-style="dashed" />
      <span>高度随字号变化</span>
    </div>
  </div>
</template>

<style scoped>
.divider-vertical-demo {
  display: grid;
  gap: 18px;
}

.divider-vertical-demo__row {
  display: flex;
  align-items: center;
  color: var(--sax-text-color-regular);
}

.divider-vertical-demo__row--large {
  font-size: 18px;
}
</style>
