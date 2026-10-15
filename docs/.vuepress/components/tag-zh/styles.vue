<template>
  <div class="tag-styles">
    <s-tag color="primary">填充（默认）</s-tag>
    <s-tag color="success" variant="outline">描边</s-tag>
    <s-tag color="danger" variant="dashed">虚线</s-tag>
    <s-tag color="warning" variant="mark">标记</s-tag>
    <s-tag color="primary" variant="arrow">箭头</s-tag>
    <s-tag color="dark" variant="flag">旗帜</s-tag>
  </div>
</template>

<style scoped lang="scss">
.tag-styles {
  display: flex;
  width: 100%;
  max-width: 620px;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
