<script setup lang="ts">
import { zhCn } from 'sax-design-vue/locales'
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notice-demo">
      <s-notice-bar
        type="info"
        content="这是一条常规工作区公告。"
      /><s-notice-bar
        type="primary"
        content="这是一条需要关注的公告。"
      /><s-notice-bar type="success" content="更新已顺利完成。" /><s-notice-bar
        type="warning"
        content="服务将在今天稍晚进行维护。"
      /><s-notice-bar
        type="danger"
        content="部分服务暂时不可用。"
      /><s-notice-bar color="#7658ab" content="使用自定义品牌颜色。" />
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
