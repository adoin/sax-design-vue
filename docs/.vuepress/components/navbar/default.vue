<template>
  <div class="center example-nav">
    <s-navbar v-model="active" center-collapsed>
      <template #left>
        <img src="/logo2.png" alt="" />
      </template>
      <s-navbar-item id="guide"> Guide </s-navbar-item>
      <s-navbar-item id="docs"> Documents </s-navbar-item>
      <s-navbar-item id="components"> Components </s-navbar-item>
      <s-navbar-item id="license"> license </s-navbar-item>
      <template #right>
        <s-button type="flat">Login</s-button>
        <s-button>Get Started</s-button>
      </template>
    </s-navbar>
    <div class="square">
      <div id="child1" class="child">child 1</div>
      <div id="child2" class="child">child 2</div>
      <div id="child3" class="child">child 3</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref('guide')
</script>

<style lang="scss" scoped>
.square {
  height: 400px;
  position: relative;
  overflow: auto;
  width: 100%;
  .child {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
}
.example-nav {
  background: #f0f0f0 !important;
  padding: 0px !important;
  position: relative;
  img {
    max-height: 22px;
  }
}
</style>
