<template>
  <div class="center">
    <s-progress :percent="62" />
    <s-progress :percent="45" color="success" />
    <s-progress :percent="80" color="warning" />
    <s-progress :percent="30" color="danger" />
    <s-progress :percent="55" color="dark" />
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
