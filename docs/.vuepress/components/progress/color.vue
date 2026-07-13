<template>
  <div class="center">
    <vs-progress :percent="70" color="primary">primary</vs-progress>
    <vs-progress :percent="70" color="success">success</vs-progress>
    <vs-progress :percent="70" color="danger">danger</vs-progress>
    <vs-progress :percent="70" color="warning">warning</vs-progress>
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
