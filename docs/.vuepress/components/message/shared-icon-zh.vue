<script setup lang="ts">
import { ref } from 'vue'
import type { AgentEditorInstance } from 'sax-design-vue'
const icon = ref('/sax-logo-mark.svg')
const text = ref('请帮我完善工作汇报中的项目进展。')
const editor = ref<AgentEditorInstance>()
</script>
<template>
  <div class="shared-agent-demo">
    <s-radio-group v-model="icon">
      <s-radio value="default">默认</s-radio>
      <s-radio value="/sax-logo-mark.svg">SVG</s-radio>
      <s-radio value="/vue-logo.png">PNG</s-radio>
    </s-radio-group>
    <s-config-provider :agent-icon="icon === 'default' ? '' : icon">
      <s-message content="这里的 Agent 图标来自同一个配置。" />
      <s-agent-editor ref="editor" v-model="text" />
      <s-button type="flat" @click="editor?.select(0, text.length)"
        >选中编辑内容</s-button
      >
    </s-config-provider>
  </div>
</template>
<style scoped>
.shared-agent-demo {
  display: grid;
  gap: 16px;
  width: 100%;
  min-width: 0;
}
</style>
