<script setup lang="ts">
import { shallowRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const visible = shallowRef(true)
const closed = shallowRef(0)
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notice-demo">
      <s-button size="small" @click="visible = true">显示公告</s-button
      ><s-notice-bar
        v-model="visible"
        closable
        content="这条公告可以关闭，并通过外部按钮重新显示。"
        @close="closed++"
      /><span role="status">关闭次数: {{ closed }}</span>
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
