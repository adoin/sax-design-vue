<script setup lang="ts">
import { ref } from 'vue'
import { zhCn } from 'sax-design-vue/locales'
const visible = ref(false)
const clicks = ref(0)
const name = ref('')
</script>

<template>
  <s-config-provider :locale="zhCn">
    <div class="drawer-demo">
      <s-button @click="visible = true">自定义各区域</s-button>
      <s-drawer
        v-model="visible"
        title="自定义设置"
        :body-style="{ padding: '24px' }"
      >
        <template #header="{ titleId, titleClass }"
          ><h3 :id="titleId" :class="titleClass">自定义标题</h3></template
        >
        <template #extra
          ><s-button size="small" type="flat" @click="clicks++"
            >额外操作</s-button
          ></template
        >
        <template #close-icon><s-icon name="cb:close" /></template>
        <s-input v-model="name" label="名称" placeholder="输入名称" block />
        <p role="status">额外操作次数: {{ clicks }}</p>
        <template #footer="{ close, closePending }"
          ><s-button :disabled="closePending" type="flat" @click="close()"
            >取消</s-button
          ><s-button :disabled="closePending" @click="close()"
            >确认</s-button
          ></template
        >
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
