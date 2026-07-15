<template>
  <div class="center">
    <s-button type="flat" @click="openLoading">
      Open Loading <b>Percent</b>
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { SLoadingFn } from 'sax-design-vue'

const percent = ref<number>(0)

const openLoading = () => {
  const loadingInstance = SLoadingFn({
    percent: percent.value,
  })

  const interval = setInterval(() => {
    if (percent.value < 100) {
      percent.value = Number(percent.value) + 1
      loadingInstance.setPercent(percent.value)
    }
  }, 40)

  setTimeout(() => {
    loadingInstance.close()
    clearInterval(interval)
    percent.value = 0
  }, 4800)
}
</script>

<style scoped lang="scss">
b {
  margin-left: 5px;
}
</style>
