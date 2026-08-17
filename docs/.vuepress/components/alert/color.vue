<template>
  <div class="center alert-example">
    <s-alert :color="color">
      <template #title> Sax Design Vue </template>
      Sax Design Vue is a <b>Vue 3 component library</b> with expressive
      visuals, practical APIs, and consistent interaction patterns for product
      interfaces.
    </s-alert>

    <s-button
      type="flat"
      :active="color == 'primary'"
      @click="color = 'primary'"
    >
      Primary
    </s-button>
    <s-button
      color="success"
      type="flat"
      :active="color == 'success'"
      @click="color = 'success'"
    >
      Success
    </s-button>
    <s-button
      color="danger"
      type="flat"
      :active="color == 'danger'"
      @click="color = 'danger'"
    >
      Danger
    </s-button>
    <s-button
      color="warn"
      type="flat"
      :active="color == 'warn'"
      @click="color = 'warn'"
    >
      Warn
    </s-button>
    <s-button
      color="dark"
      type="flat"
      :active="color == 'dark'"
      @click="color = 'dark'"
    >
      Dark
    </s-button>
    <s-button
      color="#7d33ff"
      type="flat"
      :active="color == '#7d33ff'"
      @click="color = '#7d33ff'"
    >
      HEX
    </s-button>
    <s-button
      color="rgb(59,222,200)"
      type="flat"
      :active="color == 'rgb(59,222,200)'"
      @click="color = 'rgb(59,222,200)'"
    >
      RGB
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const color = ref<string>('danger')
</script>

<style scoped lang="scss">
.alert-example {
  .s-button--active {
    transform: translate(0, -5px);
    border-radius: 0px 0px 12px 12px;
  }
}
</style>
