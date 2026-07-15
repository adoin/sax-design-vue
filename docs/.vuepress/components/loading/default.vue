<template>
  <div class="center">
    <s-button type="flat" @click="openLoading"> Open Loading </s-button>
  </div>
</template>

<script lang="ts" setup>
import { SLoadingFn } from 'sax-design-vue'

const openLoading = () => {
  const loadingInstance = SLoadingFn()
  setTimeout(() => {
    loadingInstance.close()
  }, 3000)
}
</script>
