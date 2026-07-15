<template>
  <div class="center content-inputs">
    <s-input v-model="value1" placeholder="User name">
      <template #icon>
        <i class="bx bx-user" />
      </template>
    </s-input>

    <s-input v-model="value2" type="password" icon-after placeholder="Password">
      <template #icon>
        <i class="bx bx-lock-open-alt" />
      </template>
    </s-input>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
</script>

<style lang="scss" scoped>
.content-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  .vs-input {
    margin: 10px;
  }
}
</style>
