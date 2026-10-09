<script setup lang="ts">
import { ref } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const outer = ref(false)
const inner = ref(false)
const push = ref(true)
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="drawer-demo">
      <s-checkbox v-model="push">推开父抽屉</s-checkbox>
      <s-button @click="outer = true">打开父抽屉</s-button>
      <s-drawer
        v-model="outer"
        title="父抽屉"
        :width="520"
        :push="push ? { distance: 120 } : false"
      >
        <s-button @click="inner = true">打开子抽屉</s-button>
        <s-drawer v-model="inner" title="子抽屉" :width="340">
          <p>Escape 和遮罩点击仅影响最上层抽屉。</p>
          <template #footer="{ close }"
            ><s-button @click="close()">关闭子抽屉</s-button></template
          >
        </s-drawer>
      </s-drawer>
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
