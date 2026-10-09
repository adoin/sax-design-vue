<script setup lang="ts">
import { zhCn } from 'sax-design-vue/locales'
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notice-demo">
      <s-notice-bar
        type="primary"
        variant="soft"
        content="柔和底色，适合常规公告。"
      /><s-notice-bar
        type="primary"
        variant="solid"
        content="实色背景，强调需要关注的公告。"
      /><s-notice-bar
        type="primary"
        variant="plain"
        content="简洁样式，融入当前内容区域。"
      />
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
