<template>
  <div class="shape-grid">
    <s-card
      shape="rounded"
      title="Rounded"
      text="Uses the default global geometry."
    />
    <s-card
      shape="square"
      title="Square"
      text="Removes outer and media corner rounding."
    />
  </div>
</template>

<style lang="scss" scoped>
.shape-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 20px;
  width: 100%;
  padding: 12px;
}
</style>
