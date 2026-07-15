<template>
  <div class="center">
    <s-button :active="active == 0" @click="active = 0"> Default </s-button>
    <s-button
      color="success"
      type="flat"
      :active="active == 1"
      @click="active = 1"
    >
      Success
    </s-button>
    <s-button
      color="danger"
      type="border"
      :active="active == 2"
      @click="active = 2"
    >
      Danger
    </s-button>
    <s-button
      color="warn"
      type="gradient"
      :active="active == 3"
      @click="active = 3"
    >
      Warn
    </s-button>
    <s-button
      color="dark"
      type="shadow"
      :active="active == 4"
      @click="active = 4"
    >
      Dark
    </s-button>
    <s-button
      color="#7d33ff"
      type="relief"
      :active="active == 5"
      @click="active = 5"
    >
      HEX
    </s-button>
    <s-button
      color="rgb(59,222,200)"
      type="gradient"
      :active="active == 6"
      @click="active = 6"
    >
      RGB
    </s-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref<number>(0)
</script>
