<script setup lang="ts">
import { ref } from 'vue'
import type { AgentEditorInstance } from 'sax-design-vue'
const icon = ref('/sax-logo-mark.svg')
const text = ref('Help me improve the project update in this report.')
const editor = ref<AgentEditorInstance>()
</script>
<template>
  <div class="shared-agent-demo">
    <s-radio-group v-model="icon">
      <s-radio value="default">Default</s-radio>
      <s-radio value="/sax-logo-mark.svg">SVG</s-radio>
      <s-radio value="/vue-logo.png">PNG</s-radio>
    </s-radio-group>
    <s-config-provider :agent-icon="icon === 'default' ? '' : icon">
      <s-message content="This Agent icon comes from the same configuration." />
      <s-agent-editor ref="editor" v-model="text" />
      <s-button type="flat" @click="editor?.select(0, text.length)"
        >Select editor content</s-button
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
