<template>
  <div class="center content-inputs">
    <s-input v-model="value" input-style="border" placeholder="Name" />

    <s-input
      v-model="value2"
      color="#7d33ff"
      input-style="shadow"
      placeholder="Password"
      type="password"
    >
      <template #icon>
        <s-icon  name="bx:lock-open-alt" />
      </template>
    </s-input>

    <s-input
      v-model="value3"
      color="warn"
      label="Address"
      label-float
      input-style="transparent"
      icon-after
      type="email"
    >
      <template #icon>
        <s-icon  name="bxl:bitcoin" />
      </template>
    </s-input>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const value2 = ref('')
const value3 = ref('')
</script>

<style lang="scss" scoped>
.content-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  .s-input {
    margin: 0;
  }
}
</style>
