<template>
  <div class="play-container demo">
    <div class="demo-row">
      <span>Left</span>
      <s-spacer />
      <span>Right</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-row {
  display: flex;
  align-items: center;
  width: min(480px, 90vw);
  padding: 16px;
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}
</style>
