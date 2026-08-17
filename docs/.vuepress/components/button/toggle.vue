<template>
  <div class="center">
    <s-button
      :icon="successMail"
      :upload="sendingMail"
      :color="successMail ? 'success' : 'primary'"
      @click="handleClickMail"
    >
      <span v-if="!successMail">
        <s-icon  name="bx:mail-send" />
        Send
      </span>

      <s-icon v-else  name="bx:check" />
    </s-button>

    <s-button
      :animate-inactive="successFace"
      :loading="loadingFace"
      color="facebook"
      @click="handleClickFace"
    >
      <s-icon  name="bxl:facebook-square" />
      {{ successFace ? 'Logout' : 'Facebook' }}
      <template #animate> <s-icon  name="bx:user" /> Login </template>
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const sendingMail = ref<boolean>(false)
const successMail = ref<boolean>(false)
const loadingFace = ref<boolean>(false)
const successFace = ref<boolean>(false)

const handleClickMail = () => {
  sendingMail.value = true

  setTimeout(() => {
    sendingMail.value = false
    successMail.value = !successMail.value
  }, 2000)
}
const handleClickFace = () => {
  loadingFace.value = true

  setTimeout(() => {
    loadingFace.value = false
    successFace.value = !successFace.value
  }, 2000)
}
</script>

<style scoped lang="scss">
span {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
