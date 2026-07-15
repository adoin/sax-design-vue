<template>
  <div class="center">
    <s-button type="border" icon @click="openNotificationUser">
      Example User
    </s-button>
    <s-button type="border" icon @click="openNotificationCookie">
      Example Cookie
    </s-button>
    <s-button type="border" icon @click="openNotificationCall">
      Example Call
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { createVNode } from 'vue'
import { SNotification } from 'sax-design-vue'

import user from './user.vue'
import cookie from './cookie.vue'
import call from './call.vue'

const openNotificationCookie = () => {
  SNotification({
    duration: 0,
    content: createVNode(cookie),
  })
}
const openNotificationUser = () => {
  SNotification({
    duration: 0,
    width: 'auto',
    content: createVNode(user),
  })
}
const openNotificationCall = () => {
  SNotification({
    duration: 0,
    width: 'auto',
    content: createVNode(call),
    notPadding: true,
  })
}
</script>
