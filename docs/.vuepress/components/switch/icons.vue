<template>
  <div class="center con-switch">
    <s-switch v-model="active1">
      <template #off>
        <s-icon name="bxs:volume-mute" />
      </template>
      <template #on>
        <s-icon name="bxs:volume-full" />
      </template>
    </s-switch>
    <s-switch v-model="active2" color="danger">
      <s-icon name="bxs:microphone" />
    </s-switch>
    <s-switch v-model="active3" color="success">
      <template #off>
        <s-icon name="bx:x" />
      </template>
      <template #on>
        <s-icon name="bx:check" />
      </template>
    </s-switch>
    <s-switch v-model="active4" color="warn">
      <template #off>
        <s-icon name="bxs:plane-alt" />
      </template>
      <template #on> Active </template>
    </s-switch>
    <s-switch v-model="active5" color="dark">
      <template #circle>
        <s-icon v-if="!active5" name="bxs:moon" />
        <s-icon v-else name="bxs:sun" />
      </template>
    </s-switch>
    <s-switch v-model="active6" color="#7d33ff">
      <template #circle>
        <s-icon v-if="active6" name="bxl:instagram-alt" />
        <s-icon v-else name="bxl:instagram" />
      </template>
    </s-switch>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active1 = ref(false)
const active2 = ref(false)
const active3 = ref(false)
const active4 = ref(false)
const active5 = ref(false)
const active6 = ref(false)
</script>

<style lang="scss" scoped>
.con-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  .s-switch {
    margin: 10px;
  }
}
</style>
