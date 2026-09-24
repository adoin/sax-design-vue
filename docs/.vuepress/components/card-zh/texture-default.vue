<template>
  <div class="texture-demo">
    <s-card texture="default" title="默认纯色">
      <p>默认纹理保持所选 Card 表面为纯色，不增加额外材质层。</p>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.texture-demo {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 36px;
  border-radius: var(--sax-radius-xl);
  background: hsl(var(--sax-background));
}
</style>
