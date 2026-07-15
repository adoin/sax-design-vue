<template>
  <div class="center">
    <s-badge :value="100" :max="19" type="primary" class="item">
      <s-button>comment</s-button>
    </s-badge>
    <s-badge :value="100" :max="99" class="item">
      <s-button color="warn" shape="square">comment</s-button>
    </s-badge>
    <s-badge :value="10" :max="9" class="item">
      <s-avatar shape="square" color="#ccc" />
    </s-badge>
  </div>
</template>

<style lang="scss" scoped>
.item {
  margin: 20px;
}
</style>
