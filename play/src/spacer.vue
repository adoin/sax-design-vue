<template>
  <div class="play-container demo">
    <div
      class="demo-row"
      style="display: flex; flex-direction: row; align-items: center; width: 100%"
    >
      <s-button>Left</s-button>
      <s-spacer />
      <s-button color="success">Right</s-button>
    </div>
    <p class="hint">Spacer fills the free space and pushes items to opposite ends.</p>
  </div>
</template>

<style lang="scss" scoped>
.demo-row {
  padding: 16px;
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  box-sizing: border-box;
}

.hint {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.55);
}
</style>
