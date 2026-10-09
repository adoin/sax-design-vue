<script setup lang="ts">
import { zhCn } from 'sax-design-vue/locales'
const message =
  '这是一条包含多项说明的较长公告。需要同时展示完整内容时，可以开启换行，让文本在公告栏宽度内自然排版；需要紧凑展示时，可以关闭滚动，将内容保留为静止的单行公告。'
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notice-demo">
      <s-notice-bar wrapable :content="message" /><s-notice-bar
        :scrollable="false"
        :content="message"
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
