<template>
  <div class="center">
    <s-button @click="openNotification"> Open Notification </s-button>
  </div>
</template>

<script lang="ts" setup>
import { SNotification } from 'sax-design-vue'

const openNotification = () => {
  SNotification({
    title: 'Documentation Vuesax-alpha',
    content:
      'These documents refer to the latest version of Vuesax-alpha, to see the documents of the previous versions you can do it here 👉 Vuesax4.0',
  })
}
</script>
