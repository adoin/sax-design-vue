<template>
  <div class="center">
    <vs-divider position="left">left</vs-divider>
    <vs-divider position="left-center">left-center</vs-divider>
    <vs-divider position="center">center</vs-divider>
    <vs-divider position="right-center">right-center</vs-divider>
    <vs-divider position="right">right</vs-divider>
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
