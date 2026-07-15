<template>
  <div class="center">
    <s-button size="xl" :active="active == 0" @click="active = 0">
      XLarge
    </s-button>
    <s-button size="large" :active="active == 1" @click="active = 1">
      Large
    </s-button>
    <s-button :active="active == 2" @click="active = 2"> Default </s-button>
    <s-button size="small" :active="active == 3" @click="active = 3">
      Small
    </s-button>
    <s-button size="mini" :active="active == 4" @click="active = 4">
      Mini
    </s-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const active = ref<number>(0)
</script>
