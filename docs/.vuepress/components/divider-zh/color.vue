<template>
  <div class="center">
    <s-divider>中性色</s-divider>
    <s-divider color="primary">主色</s-divider>
    <s-divider color="success">成功</s-divider>
    <s-divider color="warning">警告</s-divider>
    <s-divider color="danger">危险</s-divider>
    <s-divider color="#8756d8">自定义 HEX</s-divider>
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
