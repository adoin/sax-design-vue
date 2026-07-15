<template>
  <div class="center">
    <s-badge :value="0" class="item">
      <s-avatar shape="square" color="#ccc" />
    </s-badge>
    <s-badge :value="0" :show-zero="show" class="item">
      <s-avatar shape="square" color="#ccc" />
    </s-badge>
    <s-switch v-model="show" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
</script>

<style lang="scss" scoped>
.item {
  margin: 20px;
}
</style>
