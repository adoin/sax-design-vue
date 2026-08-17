<template>
  <div class="center">
    <s-button icon :active="active == 0" @click="active = 0">
      <s-icon  name="bx:home-alt" />
    </s-button>

    <s-button
      icon
      color="success"
      type="flat"
      :active="active == 1"
      @click="active = 1"
    >
      <s-icon  name="bxs:phone-call" />
    </s-button>

    <s-button
      icon
      color="danger"
      type="border"
      :active="active == 2"
      @click="active = 2"
    >
      <s-icon  name="bxs:heart" />>
    </s-button>

    <s-button
      icon
      color="warn"
      type="gradient"
      :active="active == 3"
      @click="active = 3"
    >
      <s-icon  name="bxs:bell-ring" />
    </s-button>

    <s-button
      icon
      color="#7d33ff"
      type="relief"
      :active="active == 5"
      @click="active = 5"
    >
      <s-icon  name="bxs:paper-plane" />
    </s-button>

    <s-button
      icon
      color="rgb(59,222,200)"
      type="gradient"
      :active="active == 6"
      @click="active = 6"
    >
      <s-icon  name="bxs:purchase-tag" />
    </s-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref<number>(0)
</script>
