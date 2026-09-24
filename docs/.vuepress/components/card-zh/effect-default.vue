<template>
  <div class="effect-demo effect-demo--plain">
    <s-card effect="default" title="无特效">
      <p>默认值不会为所选布局增加任何装饰层。</p>
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

.effect-demo--plain {
  background: hsl(var(--sax-background));
}
</style>
