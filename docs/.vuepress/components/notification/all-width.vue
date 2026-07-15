<template>
  <div class="center">
    <s-button type="shadow" icon @click="openNotification(null, '')">
      <i class="bx bx-border-bottom" />
    </s-button>
    <s-button
      type="flat"
      icon
      @click="openNotification('top-center', 'primary', 'auto')"
    >
      <i class="bx bx-border-radius b-r" />
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
    title: 'Documentation Vuesax 4.0+',
    content:
      'These documents refer to the latest version of vuesax (4.0+), to see the documents of the previous versions you can do it here 👉 Vuesax 3.x',
  })
}
</script>
<style scoped lang="scss">
.vs-button {
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
