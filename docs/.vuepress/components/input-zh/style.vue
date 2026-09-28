<template>
  <div class="center content-inputs">
    <s-input
      v-model="border"
      input-style="border"
      placeholder="Border · 底线"
    />
    <s-input v-model="shadow" input-style="shadow" placeholder="Shadow · 阴影">
      <template #icon><s-icon name="bx:user" /></template>
    </s-input>
    <s-input
      v-model="transparent"
      input-style="transparent"
      placeholder="Transparent · 无底色"
      icon-after
    >
      <template #icon><s-icon name="bx:user" /></template>
    </s-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const border = ref('')
const shadow = ref('')
const transparent = ref('')
</script>

<style scoped lang="scss">
.content-inputs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
  .s-input {
    margin: 0;
  }
}
</style>
