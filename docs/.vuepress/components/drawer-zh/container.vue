<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const visible = ref(false)
const embedded = ref(false)
const surface = useTemplateRef<HTMLElement>('surface')
const name = ref('')
const notes = ref('')
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="drawer-demo">
      <s-button @click="visible = true">打开非模态抽屉</s-button>
      <s-drawer
        v-model="visible"
        title="非模态抽屉"
        :mask="false"
        modal-penetrable
        :lock-scroll="false"
        :auto-focus="false"
        :width="320"
        ><p>页面仍可操作。</p></s-drawer
      >
      <div ref="surface" class="drawer-surface">
        <p>容器内容</p>
        <s-input v-model="name" label="名称" block />
        <s-textarea v-model="notes" label="备注" :rows="3" block />
        <s-button @click="embedded = true">在此容器内打开</s-button>
        <s-drawer
          v-model="embedded"
          title="容器内抽屉"
          :append-to="surface || 'body'"
          :lock-scroll="false"
          size="70%"
          ><p>只覆盖当前容器。</p></s-drawer
        >
      </div>
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
.drawer-surface {
  position: relative;
  display: grid;
  gap: 16px;
  width: 100%;
  padding: 20px;
  background: var(--sax-css-background);
  border-radius: 12px;
}
</style>
