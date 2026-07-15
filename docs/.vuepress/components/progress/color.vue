<template>
  <div class="center">
    <s-progress :percent="70" color="primary">primary</s-progress>
    <s-progress :percent="70" color="success">success</s-progress>
    <s-progress :percent="70" color="danger">danger</s-progress>
    <s-progress :percent="70" color="warning">warning</s-progress>
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
