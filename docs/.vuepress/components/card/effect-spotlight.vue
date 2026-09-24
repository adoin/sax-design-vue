<template>
  <div class="effect-demo effect-demo--ambient">
    <s-card effect="spotlight" title="Spotlight border" color="primary">
      <p>
        Move the pointer across the card to reveal a local single-color border
        highlight.
      </p>
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
