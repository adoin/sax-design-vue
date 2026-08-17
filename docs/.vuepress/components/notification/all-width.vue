<template>
  <div class="center">
    <s-button type="shadow" icon @click="openNotification(null, '')">
      <s-icon  name="bx:border-bottom" />
    </s-button>
    <s-button
      type="flat"
      icon
      @click="openNotification('top-center', 'primary', 'auto')"
    >
      <s-icon  name="bx:border-radius" class="b-r" />
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { SNotification } from 'sax-design-vue'

const openNotification = (position = null, color, width = 'full') => {
  SNotification({
    width,
    position,
    color,
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
  &.b-r {
    transform: rotate(90deg);
  }
}
</style>
