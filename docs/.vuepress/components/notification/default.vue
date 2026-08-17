<template>
  <div class="center">
    <s-button @click="openNotification"> Open Notification </s-button>
  </div>
</template>

<script lang="ts" setup>
import { SNotification } from 'sax-design-vue'

const openNotification = () => {
  SNotification({
    title: 'Sax Design Vue',
    content:
      'Sax Design Vue notification example with configurable content, color, and position.',
  })
}
</script>
