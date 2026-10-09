<script setup lang="ts">
import { zhCn } from 'sax-design-vue/locales'
</script>

<template>
  <s-config-provider :locale="zhCn">
    <s-notice-bar content="新版本已就绪，您可以随时查看更新说明。" />
  </s-config-provider>
</template>
