<template>
  <div class="center con-checkbox">
    <s-checkbox v-model="option" value="automatically">
      Save data automatically
    </s-checkbox>

    <span class="data">
      {{ option ? option : 'null' }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const option = ref(null)
</script>

<style scoped lang="scss">
.con-checkbox {
  flex-direction: column;
  .s-checkbox {
    min-width: 80px;
  }
  .data {
    background: rgba(0, 0, 0, 0.03);
    padding: 10px 20px;
    border-radius: 18px;
  }
}
</style>
