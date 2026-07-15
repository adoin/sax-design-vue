<template>
  <div id="con-example" class="con-example">
    <s-navbar
      v-model="active"
      :fixed="fixed"
      :shadow="shadow"
      :text-white="textWhite"
      :hide-scroll="hideScroll"
      :shadow-scroll="shadowScroll"
      :padding-scroll="paddingScroll"
      :not-line="notLine"
      :square="square"
      :color="color"
      @collapsed="handleCollapsed"
    >
      <template #left>
        <s-button v-if="collapsed" class="btn-menu" flat icon>
          <i class="bx bx-menu-alt-left" />
        </s-button>
        <img
          v-if="!textWhite"
          src="/logos/logo-vuesax-logotipo-vuesax-png-3.png"
          alt=""
        />
        <img v-else src="/logos/logo-vuesax-logotipo-vuesax-png-4.png" alt="" />
      </template>
      <s-navbar-group v-if="!collapsed">
        list
        <template #items>
          <s-navbar-item id="guide2" :active="active == 'guide2'">
            nuevo 1
          </s-navbar-item>
          <s-navbar-item id="docs2" :active="active == 'docs2'">
            nuevo 2
          </s-navbar-item>
        </template>
      </s-navbar-group>
      <s-navbar-item v-if="!collapsed" id="guide" :active="active == 'guide'">
        Guide
      </s-navbar-item>
      <s-navbar-item v-if="!collapsed" id="docs" :active="active == 'docs'">
        Documents
      </s-navbar-item>
      <s-navbar-item
        v-if="!collapsed"
        id="components"
        :active="active == 'components'"
      >
        Components
      </s-navbar-item>
      <s-navbar-item
        v-if="!collapsed"
        id="license"
        :active="active == 'license'"
      >
        license
      </s-navbar-item>
      <template #right>
        <s-button flat :color="textWhite ? '#fff' : 'primary'">Login</s-button>
        <s-button :shadow="textWhite" :color="textWhite ? '#fff' : 'primary'"
          >Get Started</s-button
        >
        <!-- <s-input square transparent color="#fff" :text-white="textWhite" placeholder="Search"></s-input> -->
      </template>
    </s-navbar>

    <div class="content-1 contentx">
      <div class="con-colors">
        <s-radio v-model="color" val="#fff"> Default </s-radio>
        <s-radio v-model="color" val="primary"> Primary </s-radio>
        <s-radio v-model="color" success val="success"> success </s-radio>
        <s-radio v-model="color" danger val="danger"> danger </s-radio>
        <s-radio v-model="color" warn val="warn"> warn </s-radio>
        <s-radio v-model="color" dark val="dark"> dark </s-radio>
      </div>
      <div class="con-opts">
        <s-switch v-model="paddingScroll"> Padding-scroll </s-switch>
        <s-switch v-model="shadow"> shadow </s-switch>
        <s-switch v-model="textWhite"> text-white </s-switch>
        <s-switch v-model="fixed"> fixed </s-switch>
        <s-switch v-model="shadowScroll"> shadow-scroll </s-switch>
        <s-switch v-model="hideScroll"> hide-scroll </s-switch>
        <s-switch v-model="notLine"> not-line </s-switch>
        <s-switch v-model="square"> square </s-switch>
      </div>
    </div>
    <div class="content-2 contentx"><h2>2</h2></div>
    <div class="content-3 contentx"><h2>3</h2></div>
    <div class="content-4 contentx"><h2>4</h2></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const active = ref('guide')
const color = ref('#fff')
const paddingScroll = ref(false)
const shadow = ref(false)
const textWhite = ref(false)
const fixed = ref(false)
const shadowScroll = ref(false)
const hideScroll = ref(false)
const notLine = ref(false)
const square = ref(false)
const collapsed = ref(false)

watch(color, (val: string) => {
  if (val !== '#fff') {
    textWhite.value = true
  } else {
    textWhite.value = false
  }
})

const handleCollapsed = (val: boolean) => {
  collapsed.value = val
}
</script>

<style lang="scss">
.btn-menu {
  margin-right: 15px;
}
.con-example {
  overflow-x: hidden;
  .contentx {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-direction: column;
    background: #f4f7f8;
    h2 {
      font-size: 2rem;
    }
    .con-colors {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      flex-wrap: wrap;
    }
    .con-opts {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border-radius: 20px;
      flex-wrap: wrap;
      .vs-switch {
        margin: 10px;
      }
    }
  }
  img {
    max-height: 25px;
  }
}
</style>
