<template>
  <div class="default-card-demo">
    <s-card title="项目概览">
      <template #extra>
        <s-button size="small" type="flat">详情</s-button>
      </template>
      <p>将标题、辅助内容与可选操作收纳在一个安静、清晰的表面中。</p>
      <template #actions>
        <s-button size="small">继续</s-button>
      </template>
    </s-card>
  </div>
</template>

<style lang="scss" scoped>
.default-card-demo {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
