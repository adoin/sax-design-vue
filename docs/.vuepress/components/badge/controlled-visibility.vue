<template>
  <div class="center">
    <s-badge :value="3" :hidden="hidden" processing class="item">
      <s-avatar shape="square" color="#ccc" />
    </s-badge>

    <s-switch v-model="hidden" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const hidden = ref(false)
</script>

<style lang="scss" scoped>
.item {
  margin: 20px;
}
</style>
