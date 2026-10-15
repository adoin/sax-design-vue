<template>
  <div class="texture-demo">
    <s-card texture="solid" title="Solid surface (default)">
      <p>
        The default texture keeps the selected Card surface solid and plain.
      </p>
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
