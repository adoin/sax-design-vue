<template>
  <div class="center">
    <s-button type="flat" @click="openLoading">
      Open Loading <b>Text</b>
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { SLoadingFn } from 'sax-design-vue'

const openLoading = () => {
  const loadingInstance = SLoadingFn({
    text: 'Loading...',
  })

  setTimeout(() => {
    loadingInstance.close()
  }, 3000)
}
</script>

<style scoped lang="scss">
b {
  margin-left: 5px;
}
</style>
