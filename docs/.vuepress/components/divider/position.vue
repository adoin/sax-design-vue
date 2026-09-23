<template>
  <div class="center">
    <s-divider position="left">Start</s-divider>
    <s-divider position="left-center">Near start</s-divider>
    <s-divider position="center">Center</s-divider>
    <s-divider position="right-center">Near end</s-divider>
    <s-divider position="right">End</s-divider>
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
