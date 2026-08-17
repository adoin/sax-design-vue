<template>
  <div class="center">
    <s-button
      type="shadow"
      icon
      @click="openNotification(null, null, notificationIcons.time)"
    >
      <s-icon  name="bx:border-radius" class="b-r" />
      <s-icon  name="bxs:time" />
    </s-button>
    <s-button
      type="flat"
      icon
      @click="
        openNotification(null, 'primary', notificationIcons.user)
      "
    >
      <s-icon  name="bx:border-radius" class="b-r" />
      <s-icon  name="bxs:user-pin" />
    </s-button>
    <s-button
      type="flat"
      color="success"
      icon
      @click="
        openNotification(
          'top-right',
          'success',
          notificationIcons.select,
        )
      "
    >
      <s-icon  name="bx:border-radius" class="t-r" />
      <s-icon  name="bx:select-multiple" />
    </s-button>
    <s-button
      type="flat"
      color="danger"
      icon
      @click="
        openNotification('top-left', 'danger', notificationIcons.bug)
      "
    >
      <s-icon  name="bx:border-radius" class="t-l" />
      <s-icon  name="bxs:bug" />
    </s-button>
    <s-button
      type="flat"
      color="warn"
      icon
      @click="
        openNotification('bottom-left', 'warn', notificationIcons.error)
      "
    >
      <s-icon  name="bx:border-radius" class="b-l" />
      <s-icon  name="bx:error" />
    </s-button>
    <s-button
      type="flat"
      color="dark"
      icon
      @click="
        openNotification(
          'bottom-center',
          'dark',
          notificationIcons.folder,
        )
      "
    >
      <s-icon  name="bx:border-bottom" />
      <s-icon  name="bx:folder-open" />
    </s-button>
    <s-button
      type="flat"
      color="#7d33ff"
      icon
      @click="
        openNotification('top-center', '#7d33ff', notificationIcons.bell)
      "
    >
      <s-icon  name="bx:border-top" />
      <s-icon  name="bx:bell" />
    </s-button>
    <s-button
      type="flat"
      color="rgb(59,222,200)"
      icon
      @click="
        openNotification(
          null,
          'rgb(59,222,200)',
          notificationIcons.calendar,
        )
      "
    >
      <s-icon  name="bx:border-radius" class="b-r" />
      <s-icon  name="bx:calendar" />
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, h } from 'vue'
import { SIcon, SNotification } from 'sax-design-vue'

const createNotificationIcon = (name: string) =>
  defineComponent({
    name: 'NotificationExampleIcon',
    setup: () => () => h(SIcon, { name }),
  })

const notificationIcons = {
  time: createNotificationIcon('bxs:time'),
  user: createNotificationIcon('bxs:user-pin'),
  select: createNotificationIcon('bx:select-multiple'),
  bug: createNotificationIcon('bxs:bug'),
  error: createNotificationIcon('bx:error'),
  folder: createNotificationIcon('bx:folder-open'),
  bell: createNotificationIcon('bx:bell'),
  calendar: createNotificationIcon('bx:calendar'),
}

const openNotification = (position = null, color, icon) => {
  SNotification({
    icon,
    color,
    position,
    title: 'Sax Design Vue',
    content:
      'Sax Design Vue notification example with configurable content, color, and position.',
  })
}
</script>

<style scoped lang="scss">
.s-button {
  margin: 10px;
}
.s-icon {
  margin: 2px;
  font-size: 1.2rem;
  transform-origin: center;
  &.b-r {
    transform: rotate(90deg);
  }
  &.t-r {
    transform: rotate(0deg);
  }
  &.t-l {
    transform: rotate(-90deg);
  }
  &.b-l {
    transform: rotate(-180deg);
  }
}
</style>
