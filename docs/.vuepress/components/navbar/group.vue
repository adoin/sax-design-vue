<template>
  <div class="center example-nav">
    <s-navbar v-model="active" center-collapsed>
      <template #left>
        <img src="/logo2.png" alt="" />
      </template>
      <s-navbar-group>
        Docs
        <template #items>
          <s-navbar-item id="guide" :active="active == 'guide'">
            Guide
          </s-navbar-item>
          <s-navbar-item id="docs" :active="active == 'docs'">
            Documents
          </s-navbar-item>
          <s-navbar-item id="components" :active="active == 'components'">
            Components
          </s-navbar-item>
        </template>
      </s-navbar-group>

      <s-navbar-group>
        Ecosystem

        <template #items>
          <h5 class="title">Social</h5>

          <s-navbar-item id="Github" :active="active == 'Github'">
            Github
          </s-navbar-item>
          <s-navbar-item id="Discord" :active="active == 'Discord'">
            Discord
          </s-navbar-item>
          <s-navbar-item id="Twitter" :active="active == 'Twitter'">
            Twitter
          </s-navbar-item>
          <s-navbar-item id="Medium" :active="active == 'Medium'">
            Medium
          </s-navbar-item>
        </template>
      </s-navbar-group>

      <s-navbar-item id="License" :active="active == 'License'">
        License
      </s-navbar-item>

      <template #right>
        <s-button type="flat">Login</s-button>
        <s-button>Get Started</s-button>
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

const active = ref('guide')
</script>

<style lang="scss" scoped>
.title {
  text-align: left;
  margin: 0px;
  width: 100%;
  padding: 5px 6px;
}
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
    max-height: 25px;
  }
}
</style>
