<template>
  <div class="center con-checkbox">
    <s-checkbox v-model="option1">
      {{ option1 }}
    </s-checkbox>
    <s-checkbox v-model="option2">
      {{ option2 }}
    </s-checkbox>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const option1 = ref<boolean>(true)
const option2 = ref<boolean>(false)
</script>

<style scoped lang="scss">
.con-checkbox {
  .s-checkbox {
    min-width: 80px;
  }
}
</style>
