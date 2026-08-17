<template>
  <div class="center">
    <s-button type="shadow" icon @click="openNotification(null, null)">
      <s-icon  name="bx:border-radius" class="b-r" />
    </s-button>
    <s-button flat icon @click="openNotification(null, 'primary')">
      <s-icon  name="bx:border-radius" class="b-r" />
    </s-button>
    <s-button
      type="flat"
      color="success"
      icon
      @click="openNotification('top-right', 'success')"
    >
      <s-icon  name="bx:border-radius" class="t-r" />
    </s-button>
    <s-button
      type="flat"
      color="danger"
      icon
      @click="openNotification('top-left', 'danger')"
    >
      <s-icon  name="bx:border-radius" class="t-l" />
    </s-button>
    <s-button
      type="flat"
      color="warn"
      icon
      @click="openNotification('bottom-left', 'warn')"
    >
      <s-icon  name="bx:border-radius" class="b-l" />
    </s-button>
    <s-button
      type="flat"
      color="dark"
      icon
      @click="openNotification('bottom-center', 'dark')"
    >
      <s-icon  name="bx:border-bottom" />
    </s-button>
    <s-button
      type="flat"
      color="#7d33ff"
      icon
      @click="openNotification('top-center', '#7d33ff')"
    >
      <s-icon  name="bx:border-top" />
    </s-button>
    <s-button
      type="flat"
      color="rgb(59,222,200)"
      icon
      @click="openNotification(null, 'rgb(59,222,200)')"
    >
      <s-icon  name="bx:border-radius" class="b-r" />
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { SNotification } from 'sax-design-vue'

const openNotification = (position = null, color) => {
  SNotification({
    sticky: true,
    color,
    duration: 0,
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
