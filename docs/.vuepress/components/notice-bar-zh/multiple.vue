<script setup lang="ts">
import { shallowRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
import type { NoticeBarItem } from 'sax-design-vue'
const paused = shallowRef(false)
const index = shallowRef(0)
const notices: NoticeBarItem[] = [
  { id: 'update', content: '新版本更新说明已就绪。', type: 'primary' },
  { id: 'success', content: '共享资源已完成更新。', type: 'success' },
  {
    id: 'maintenance',
    content: '请在维护开始前保存当前修改。',
    type: 'warning',
  },
]
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notice-demo">
      <s-switch v-model="paused" aria-label="暂停轮播">暂停轮播</s-switch
      ><s-notice-bar
        v-model:active-index="index"
        :items="notices"
        :paused="paused"
        :interval="3000"
        show-navigation
        show-indicator
      /><span role="status">当前公告: {{ index + 1 }}</span>
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
