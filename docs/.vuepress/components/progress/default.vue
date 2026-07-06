<template>
  <div class="center">
    <vs-progress :percent="60" color="primary" />
    <vs-progress indeterminate color="success" />
  </div>
</template>

<style scoped lang="scss">
.center {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 420px;
}
</style>
