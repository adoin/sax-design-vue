<template>
  <div class="center con-avatars">
    <s-button type="border" icon @click="openNotification(null, 'primary')">
      <i class="bx bx-border-radius b-r" />
    </s-button>
    <s-button
      type="border"
      color="success"
      icon
      @click="openNotification('top-right', 'success')"
    >
      <i class="bx bx-border-radius t-r" />
    </s-button>
    <s-button
      type="border"
      color="danger"
      icon
      @click="openNotification('top-left', 'danger')"
    >
      <i class="bx bx-border-radius t-l" />
    </s-button>
    <s-button
      type="border"
      color="warn"
      icon
      @click="openNotification('bottom-left', 'warn')"
    >
      <i class="bx bx-border-radius b-l" />
    </s-button>
    <s-button
      type="border"
      color="dark"
      icon
      @click="openNotification('bottom-center', 'dark')"
    >
      <i class="bx bx-border-bottom" />
    </s-button>
    <s-button
      type="border"
      color="#7d33ff"
      icon
      @click="openNotification('top-center', '#7d33ff')"
    >
      <i class="bx bx-border-top" />
    </s-button>
    <s-button
      type="border"
      color="rgb(59,222,200)"
      icon
      @click="openNotification(null, 'rgb(59,222,200)')"
    >
      <i class="bx bx-border-radius b-r" />
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { SNotification } from 'sax-design-vue'

const openNotification = (position = null, border) => {
  SNotification({
    border,
    position,
    title: 'Documentation Vuesax-alpha',
    content:
      'These documents refer to the latest version of Vuesax-alpha, to see the documents of the previous versions you can do it here 👉 Vuesax4.0',
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
