<template>
  <div class="center con-pagination">
    <div class="con-radio">
      <s-radio v-model="color" color="success" value="success">
        Success
      </s-radio>
      <s-radio v-model="color" color="danger" value="danger"> Danger </s-radio>
      <s-radio v-model="color" color="warn" value="warn"> Warning </s-radio>
      <s-radio v-model="color" color="dark" value="dark"> Dark </s-radio>
      <s-radio v-model="color" color="#7d33ff" value="#7d33ff"> HEX </s-radio>
      <s-radio v-model="color" color="rgb(59,222,200)" value="rgb(59,222,200)">
        RGB
      </s-radio>
    </div>
    <s-pagination v-model:current-page="page" :color="color" :total="50" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Color } from 'sax-design-vue'

const page = ref(1)
const color = ref<Color>('success')
</script>

<style lang="scss" scoped>
.con-pagination {
  .con-radio {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    .s-radio-wrapper {
      margin: 10px;
    }
  }
  .s-pagination {
    margin: 10px 0px;
  }
}

@media screen and (max-width: 768px) {
  .con-pagination {
    overflow: scroll;
    justify-content: flex-start;
  }
}
</style>
