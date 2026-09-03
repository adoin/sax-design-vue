<template>
  <div class="center">
    <s-popper trigger="click">
      <s-button>打开浮层</s-button>

      <template #content>
        <div class="popper-example">
          <strong>在这里补充说明</strong>
          <p>将提示和补充信息放在当前操作旁边，随时查看。</p>
        </div>
      </template>
    </s-popper>
  </div>
</template>

<style scoped>
.popper-example {
  display: grid;
  gap: 6px;
  width: 240px;
  max-width: calc(100vw - 64px);
}
.popper-example strong {
  font-weight: 600;
  color: hsl(var(--sax-primary));
}
.popper-example p {
  margin: 0;
  color: hsl(var(--sax-text) / 0.75);
}
</style>
