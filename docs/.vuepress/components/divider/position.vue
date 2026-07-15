<template>
  <div class="center">
    <s-divider position="left">left</s-divider>
    <s-divider position="left-center">left-center</s-divider>
    <s-divider position="center">center</s-divider>
    <s-divider position="right-center">right-center</s-divider>
    <s-divider position="right">right</s-divider>
  </div>
</template>

<style scoped lang="scss">
.center {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
