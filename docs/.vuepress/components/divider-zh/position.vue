<template>
  <div class="center">
    <s-divider position="left">左侧</s-divider>
    <s-divider position="left-center">偏左</s-divider>
    <s-divider position="center">居中</s-divider>
    <s-divider position="right-center">偏右</s-divider>
    <s-divider position="right">右侧</s-divider>
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
