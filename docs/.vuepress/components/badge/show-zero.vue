<template>
  <div class="center">
    <s-badge :value="0" class="item">
      <s-avatar shape="square" color="#ccc" />
    </s-badge>
    <s-badge :value="0" :show-zero="false" class="item">
      <s-avatar shape="square" color="#ccc" />
    </s-badge>
  </div>
</template>

<style lang="scss" scoped>
.item {
  margin: 20px;
}
</style>
