<template>
  <div class="effect-demo effect-demo--plain">
    <s-card effect="default" title="No effect">
      <p>The default value adds no decorative layer to the selected layout.</p>
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
