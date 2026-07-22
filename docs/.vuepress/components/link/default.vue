<template>
  <div class="link-demo">
    <s-link href="https://vxeui.com" target="_blank">Default link</s-link>
    <s-link status="success">Success</s-link>
    <s-link type="danger" :underline="false">No underline</s-link>
  </div>
</template>

<style scoped>
.link-demo {
  display: flex;
  gap: 18px;
}
</style>
