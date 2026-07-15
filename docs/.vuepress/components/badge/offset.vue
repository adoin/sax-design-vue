<template>
  <div class="center">
    <s-badge :value="2" :offset="[-80, 0]" type="warn" class="item">
      <s-button shape="square">square</s-button>
    </s-badge>
    <s-badge :value="7" class="item">
      <s-avatar>
        <img src="/avatars/avatar-5.png" alt="" />
      </s-avatar>
    </s-badge>
    <s-badge :value="3" :offset="[-20, 20]" class="item">
      <s-avatar shape="square" color="#ccc" />
    </s-badge>
  </div>
</template>

<style lang="scss" scoped>
.item {
  margin: 10px;
}
</style>
