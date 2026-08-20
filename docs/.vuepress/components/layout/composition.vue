<template>
  <s-layout-container direction="vertical" :gap="12" class="layout-composition">
    <s-layout-header sticky sticky-offset="12px" :z-index="20" :padding="16">
      Sticky composable header
    </s-layout-header>
    <s-layout-container :gap="12">
      <s-layout-body :padding="16">
        <strong>Primary content</strong>
        <span>Containers can be nested in either direction.</span>
      </s-layout-body>
      <s-layout-aside size="180" :padding="16">
        <strong>Right rail</strong>
        <span>Use semantic sections wherever the page needs them.</span>
      </s-layout-aside>
    </s-layout-container>
    <s-layout-footer :padding="16">Composable footer</s-layout-footer>
  </s-layout-container>
</template>

<style scoped>
.layout-composition {
  padding: 14px;
  border-radius: var(--sax-radius-xl);
  background: rgba(25, 91, 255, 0.055);
  box-shadow: 0 20px 42px -32px rgba(25, 91, 255, 0.5);
}

.layout-composition :deep(.s-layout-body),
.layout-composition :deep(.s-layout-aside) {
  display: grid;
  align-content: center;
  gap: 5px;
  min-height: 128px;
}

.layout-composition span {
  color: rgba(44, 62, 80, 0.68);
  font-size: 12px;
}

@media (max-width: 767px) {
  .layout-composition > :deep(.s-layout-container--horizontal) {
    flex-direction: column;
  }

  .layout-composition :deep(.s-layout-aside) {
    width: 100% !important;
  }
}
</style>
