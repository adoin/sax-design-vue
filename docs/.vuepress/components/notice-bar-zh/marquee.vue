<script setup lang="ts">
import { shallowRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const paused = shallowRef(false)
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notice-demo">
      <s-switch v-model="paused" aria-label="暂停滚动">暂停滚动</s-switch
      ><s-notice-bar
        :paused="paused"
        :speed="42"
        :delay="500"
        content="请先阅读本次工作区公告：这里提供可用资源、近期变化和获取帮助的方式。长文本仅在内容超过公告栏宽度时滚动，您可以将鼠标移到公告栏上暂停阅读，也可以使用上方的开关控制暂停状态。内容会完整滚过一轮，末尾与开头之间保持自然间距。"
      /><s-notice-bar content="短公告保持静止。" />
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
