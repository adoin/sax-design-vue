<template>
  <div class="center">
    <s-badge :value="2" is-dot type="warn" class="item">
      <s-button shape="square">square</s-button>
    </s-badge>
    <s-badge :value="2" is-dot class="item"> text </s-badge>
    <s-badge :value="7" is-dot class="item">
      <s-avatar>
        <img src="/avatars/avatar-5.png" alt="" />
      </s-avatar>
    </s-badge>
    <s-badge :value="3" is-dot class="item">
      <s-avatar shape="square" color="#ccc" />
    </s-badge>
  </div>
</template>

<style lang="scss" scoped>
.item {
  margin: 10px;
}
</style>
