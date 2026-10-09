<script setup lang="ts">
import { zhCn } from 'sax-design-vue/locales'
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notice-demo">
      <s-notice-bar size="small" content="小尺寸公告" closable /><s-notice-bar
        size="default"
        content="默认尺寸公告"
        closable
      /><s-notice-bar size="large" content="大尺寸公告" closable />
    </div>
  </s-config-provider>
</template>

<style scoped>
.notice-demo {
  display: grid;
  align-items: start;
  justify-items: start;
  gap: 16px;
  width: 100%;
}
.notice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
}
.notice-grid p {
  margin: 0 0 12px;
}
</style>
