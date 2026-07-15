<template>
  <div class="center">
    <s-badge :value="12" class="item">
      <s-button color="warn">comment</s-button>
    </s-badge>
    <s-badge :value="2" type="warn" class="item">
      <s-button shape="square">square</s-button>
    </s-badge>
    <s-badge :value="2" class="item" color="#ccc"> text </s-badge>
    <s-badge :value="7" class="item">
      <s-avatar>
        <img src="/avatars/avatar-5.png" alt="" />
      </s-avatar>
    </s-badge>
    <s-badge :value="3" class="item">
      <s-avatar shape="square" color="#ccc" />
    </s-badge>
  </div>
</template>

<style lang="scss" scoped>
.item {
  margin: 10px;
}
</style>
