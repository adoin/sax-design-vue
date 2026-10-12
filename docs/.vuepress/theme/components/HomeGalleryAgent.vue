<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { AgentAttachment, AgentTask, ChatInputModel } from 'sax-design-vue'
const props = defineProps<{ zh: boolean; compact?: boolean }>()
defineEmits<{ navigate: [path: string] }>()
const text = shallowRef('')
const attachments = shallowRef<AgentAttachment[]>([])
const sent = shallowRef('')
const model = shallowRef('sol')
const fast = shallowRef(false)
const reasoning = shallowRef('medium')
const expanded = shallowRef(false)
const status = shallowRef<'pending' | 'approved' | 'rejected'>('pending')
const models = computed<ChatInputModel[]>(() => [
  {
    value: 'sol',
    label: 'GPT-6.1 Sol',
    capabilities: {
      fast: true,
      reasoning: {
        options: [
          { value: 'low', label: props.zh ? '低' : 'Low' },
          { value: 'medium', label: props.zh ? '中' : 'Medium' },
          { value: 'high', label: props.zh ? '高' : 'High' },
        ],
        default: 'medium',
      },
    },
  },
  {
    value: 'custom',
    label: props.zh ? '自定义模型' : 'Custom model',
    capabilities: {},
  },
])
const tasks = computed<AgentTask[]>(() => [
  {
    id: '1',
    title: props.zh ? '梳理本周项目进展' : 'Review this week’s progress',
    status: 'pending',
  },
  {
    id: '2',
    title: props.zh ? '补充风险与解决方案' : 'Add risks and mitigations',
    status: 'pending',
  },
  {
    id: '3',
    title: props.zh ? '整理下一步计划' : 'Outline the next steps',
    status: 'pending',
  },
])
function submit(value: string) {
  sent.value = value || (props.zh ? '已选择附件' : 'Attachment selected')
  text.value = ''
  attachments.value = []
}
</script>
<template>
  <section class="gallery-agent">
    <header>
      <div>
        <strong>{{ zh ? 'Agent 工作台' : 'Agent workspace' }}</strong
        ><span>{{
          zh ? '附件 · 模型能力 · 思考强度' : 'Attachments · Models · Reasoning'
        }}</span>
      </div>
      <s-button
        size="mini"
        type="transparent"
        @click="$emit('navigate', '/components/chat-input.html')"
        >{{ zh ? '探索' : 'Explore' }} ↗</s-button
      >
    </header>
    <s-plan-card
      v-if="!compact"
      v-model:expanded="expanded"
      :status="status"
      :tasks="tasks"
      :title="zh ? '整理本周工作汇报' : 'Prepare the weekly report'"
      :description="
        zh ? '先确认计划，再继续处理。' : 'Review the plan before proceeding.'
      "
      @approve="status = 'approved'"
      @reject="status = 'rejected'"
    />
    <s-chat-input
      v-model="text"
      v-model:attachments="attachments"
      v-model:model="model"
      v-model:fast="fast"
      v-model:reasoning="reasoning"
      :models="models"
      :placeholder="
        zh
          ? '整理本周进展，列出下一步计划…'
          : 'Summarize progress and plan the next steps…'
      "
      :speech-language="zh ? 'zh-CN' : 'en-US'"
      @submit="submit"
    />
    <p v-if="sent" role="status">
      {{ zh ? '已提交演示内容：' : 'Demo submitted: ' }}{{ sent }}
    </p>
    <s-button
      v-if="!compact && status !== 'pending'"
      size="small"
      type="flat"
      @click="status = 'pending'"
      >{{ zh ? '重新体验审批' : 'Reset approval' }}</s-button
    >
  </section>
</template>
<style scoped lang="scss">
.gallery-agent {
  display: grid;
  gap: 14px;
  min-width: 0;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
header > div {
  display: grid;
  gap: 3px;
}
header strong {
  font-size: 13px;
}
header span,
p {
  font-size: 11px;
  color: hsl(var(--sax-theme-color) / 0.55);
}
p {
  margin: 0;
  line-height: 1.6;
  overflow-wrap: anywhere;
}
</style>
