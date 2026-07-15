<template>
  <div class="center">
    <s-button type="border" icon @click="openNotification">
      <i class="bx bx-border-radius b-r" />
    </s-button>
    <s-button type="border" icon @click="openNotification('top-right')">
      <i class="bx bx-border-radius t-r" />
    </s-button>
    <s-button type="border" icon @click="openNotification('top-left')">
      <i class="bx bx-border-radius t-l" />
    </s-button>
    <s-button type="border" icon @click="openNotification('bottom-left')">
      <i class="bx bx-border-radius b-l" />
    </s-button>
    <s-button type="border" icon @click="openNotification('bottom-center')">
      <i class="bx bx-border-bottom" />
    </s-button>
    <s-button type="border" icon @click="openNotification('top-center')">
      <i class="bx bx-border-top" />
    </s-button>
  </div>
</template>

<script lang="ts" setup>
import { SNotification } from 'sax-design-vue'

const openNotification = (position = null) => {
  SNotification({
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
