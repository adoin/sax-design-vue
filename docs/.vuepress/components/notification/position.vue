<template>
  <div class="center">
    <s-button type="border" icon @click="openNotification">
      <s-icon  name="bx:border-radius" class="b-r" />
    </s-button>
    <s-button type="border" icon @click="openNotification('top-right')">
      <s-icon  name="bx:border-radius" class="t-r" />
    </s-button>
    <s-button type="border" icon @click="openNotification('top-left')">
      <s-icon  name="bx:border-radius" class="t-l" />
    </s-button>
    <s-button type="border" icon @click="openNotification('bottom-left')">
      <s-icon  name="bx:border-radius" class="b-l" />
    </s-button>
    <s-button type="border" icon @click="openNotification('bottom-center')">
      <s-icon  name="bx:border-bottom" />
    </s-button>
    <s-button type="border" icon @click="openNotification('top-center')">
      <s-icon  name="bx:border-top" />
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { SNotification } from 'sax-design-vue'

const openNotification = (position = null) => {
  SNotification({
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
