<template>
  <div class="center con-checkbox">
    <s-checkbox v-model="option" loading> Loading checked </s-checkbox>
    <s-checkbox v-model="option2" loading> Loading unchecked </s-checkbox>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const option = ref(true)
const option2 = ref(false)
</script>

<style scoped lang="scss">
.con-checkbox {
  flex-direction: column;
  align-items: flex-start;
}
</style>
