<template>
  <div class="notification-content-actions">
    <SButton type="border" @click="openNotificationUser">
      {{ labels.user }}
    </SButton>
    <SButton type="border" @click="openNotificationCookie">
      {{ labels.cookie }}
    </SButton>
    <SButton type="border" @click="openNotificationCall">
      {{ labels.call }}
    </SButton>
  </div>
</template>

<script lang="ts" setup>
import { computed, createVNode } from 'vue'
import { useRoute } from 'vue-router'
import { SButton, SNotification } from 'sax-design-vue'

import UserNotificationContent from './user.vue'
import CookieNotificationContent from './cookie.vue'
import CallNotificationContent from './call.vue'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const labels = computed(() =>
  isZh.value
    ? { user: '用户动态', cookie: 'Cookie 提示', call: '来电通知' }
    : { user: 'User activity', cookie: 'Cookie notice', call: 'Incoming call' },
)

const openNotificationCookie = () => {
  SNotification({
    duration: 0,
    content: createVNode(CookieNotificationContent),
  })
}
const openNotificationUser = () => {
  SNotification({
    duration: 0,
    width: 'auto',
    content: createVNode(UserNotificationContent),
  })
}
const openNotificationCall = () => {
  SNotification({
    duration: 0,
    width: 'auto',
    content: createVNode(CallNotificationContent),
    notPadding: true,
  })
}
</script>

<style lang="scss" scoped>
.notification-content-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;

  .s-button {
    min-width: 112px;
  }
}
</style>
