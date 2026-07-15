<template>
  <div class="center">
    <s-button :active="active == 0" @click="active = 0">
      <i class="bx bx-home-alt" /> Home
    </s-button>

    <s-button
      color="success"
      type="flat"
      :active="active == 1"
      @click="active = 1"
    >
      <i class="bx bxs-phone-call" /> Call
    </s-button>

    <s-button
      color="danger"
      type="border"
      :active="active == 2"
      @click="active = 2"
    >
      <i class="bx bxs-heart" /> Like
    </s-button>

    <s-button
      color="warn"
      type="gradient"
      :active="active == 3"
      @click="active = 3"
    >
      <i class="bx bxs-bell-ring" /> Notifications
    </s-button>

    <s-button
      color="#7d33ff"
      type="relief"
      :active="active == 5"
      @click="active = 5"
    >
      <i class="bx bxs-paper-plane" /> Send
    </s-button>

    <s-button
      color="rgb(59,222,200)"
      type="gradient"
      :active="active == 6"
      @click="active = 6"
    >
      <i class="bx bxs-purchase-tag" /> Save
    </s-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref<number>(0)
</script>
