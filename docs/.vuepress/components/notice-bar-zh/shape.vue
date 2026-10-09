<script setup lang="ts">
import { zhCn } from 'sax-design-vue/locales'
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="notice-grid">
      <div>
        <p>圆角</p>
        <s-notice-bar
          type="primary"
          shape="rounded"
          content="通过 shape 选择公告栏的外形。"
          closable
        />
      </div>
      <div>
        <p>直角</p>
        <s-notice-bar
          type="primary"
          shape="square"
          content="通过 shape 选择公告栏的外形。"
          closable
        />
      </div>
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
