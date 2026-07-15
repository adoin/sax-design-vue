<template>
  <div class="center">
    <s-button type="flat" @click="active = !active">
      Open Dialog Not Padding
    </s-button>
    <s-dialog v-model="active" not-close auto-width not-padding>
      <div class="con-image">
        <img src="/foto1.png" alt="" />
      </div>
    </s-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(false)
</script>

<style lang="scss" scoped>
.con-image {
  border-radius: inherit;
  img {
    display: block;
    position: relative;
    border-radius: inherit;
    max-width: 350px;
  }
}
</style>
