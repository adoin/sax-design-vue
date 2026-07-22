<template>
  <s-layout-container direction="vertical" class="layout-demo">
    <s-layout-header>Workspace header</s-layout-header>
    <s-layout-container>
      <s-layout-aside size="150">Navigation</s-layout-aside>
      <s-layout-body>Flexible content area</s-layout-body>
    </s-layout-container>
    <s-layout-footer>Footer</s-layout-footer>
  </s-layout-container>
</template>

<style scoped>
.layout-demo {
  height: 240px;
}
</style>
