<template>
  <div class="center">
    <vs-progress :percent="70" color="primary" />
    <vs-progress :percent="70" color="success" />
    <vs-progress :percent="70" color="danger" />
    <vs-progress :percent="70" color="warning" />
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
