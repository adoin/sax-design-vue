<template>
  <div class="shape-grid">
    <s-card
      shape="rounded"
      variant="outlined"
      title="圆角"
      text="使用默认的全局圆角形态。"
    />
    <s-card
      shape="square"
      variant="outlined"
      title="直角"
      text="移除卡片外框与媒体区域的圆角。"
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
