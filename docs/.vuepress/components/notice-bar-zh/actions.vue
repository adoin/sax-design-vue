<script setup lang="ts">
import { shallowRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const visible = shallowRef(true)
const read = shallowRef(false)
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notice-demo">
      <s-button size="small" type="flat" @click="visible = true"
        >重新显示</s-button
      ><s-notice-bar v-model="visible" type="primary" href="#api" closable
        ><template #prefix><s-tag size="small">公告</s-tag></template
        ><template #content
          ><strong>了解公告栏的完整 API</strong> · 点击内容可跳转到 API
          参考</template
        ><template #suffix
          ><s-tag size="small" :color="read ? 'success' : 'primary'">{{
            read ? '已读' : '未读'
          }}</s-tag></template
        ><template #actions="{ close }"
          ><s-button size="small" type="flat" @click="read = true"
            >标为已读</s-button
          ><s-button size="small" type="flat" @click="close()"
            >忽略</s-button
          ></template
        ></s-notice-bar
      >
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
