<template>
  <div class="center">
    <vs-progress :percent="55" :height="6" />
    <vs-progress :percent="55" :height="12" color="success" />
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
