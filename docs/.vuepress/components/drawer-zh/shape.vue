<script setup lang="ts">
import { ref } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const rounded = ref(false)
const square = ref(false)
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="drawer-demo">
      <s-button @click="rounded = true">圆角抽屉</s-button>
      <s-button @click="square = true">方形抽屉</s-button>
      <s-drawer v-model="rounded" title="圆角抽屉" shape="rounded"
        ><p>外侧角保持圆角。</p></s-drawer
      >
      <s-drawer v-model="square" title="方形抽屉" shape="square"
        ><p>面板使用方形外观。</p></s-drawer
      >
    </div>
  </s-config-provider>
</template>

<style scoped>
.drawer-demo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
