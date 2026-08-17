<template>
  <div class="center con-avatars">
    <s-button type="border" @click="openNotification(4500)">
      Duration default (4.5s)
    </s-button>
    <s-button type="border" @click="openNotification(6000)">
      Duration 6s
    </s-button>
    <s-button type="border" @click="openNotification(10000)">
      Duration 10s
    </s-button>
    <s-button type="border" @click="openNotification(0)">
      Duration none
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { SNotification } from 'sax-design-vue'

const openNotification = (duration) => {
  SNotification({
    duration,
    progressAuto: true,
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
i {
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
