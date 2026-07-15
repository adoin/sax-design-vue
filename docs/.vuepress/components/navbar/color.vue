<template>
  <div class="center example-nav">
    <s-navbar v-model="active" text-white :color="active" right-collapsed>
      <template #left>
        <img src="/logos/logo-vuesax-logotipo-vuesax-png-4.png" alt="" />
      </template>
      <template #right>
        <s-navbar-item id="primary"> Primary </s-navbar-item>
        <s-navbar-item id="success"> Success </s-navbar-item>
        <s-navbar-item id="danger"> Danger </s-navbar-item>
        <s-navbar-item id="warn"> Warn </s-navbar-item>
        <s-navbar-item id="dark"> Dark </s-navbar-item>
        <s-navbar-item id="#7d33ff"> HEX </s-navbar-item>
        <s-navbar-item id="rgb(59,222,200)"> RGB </s-navbar-item>
      </template>
    </s-navbar>
    <div class="square">
      <div class="child">child 1</div>
      <div class="child">child 2</div>
      <div class="child">child 3</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { Color } from 'sax-design-vue'

const active = ref<Color>('primary')
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
