<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import type { AgentHistoryMessage } from 'sax-design-vue'
const make = (id: number): AgentHistoryMessage => ({
  id: String(id),
  role: id % 2 ? 'assistant' : 'user',
  content:
    id % 2
      ? Array.from(
          { length: (id % 7) + 1 },
          () =>
            '本周已完成接口联调和回归验证。接下来会完善异常处理、补充监控，并在周五前完成上线评审。',
        ).join('\n\n')
      : `请帮我整理工作汇报的第 ${(id % 5) + 1} 部分，重点说明进展和风险。`,
})
const messages = ref(Array.from({ length: 200 }, (_, i) => make(1000 + i)))
const hasMore = ref(true)
let oldest = 1000
let nextId = 1200
let pages = 3
const loadOlder = (signal: AbortSignal) =>
  new Promise<AgentHistoryMessage[]>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort)
      const start = oldest - 20
      oldest = start
      pages--
      hasMore.value = pages > 0
      resolve(Array.from({ length: 20 }, (_, i) => make(start + i)))
    }, 500)
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  })
function append() {
  messages.value.push(make(nextId++), make(nextId++))
}
let stream: ReturnType<typeof setInterval> | undefined
function grow() {
  if (stream) return
  const item = messages.value[messages.value.length - 1]
  let chunks = 0
  stream = setInterval(() => {
    item.content +=
      '\n\n本周已完成接口联调和回归验证。接下来会完善异常处理、补充监控，并在周五前完成上线评审。'
    if (++chunks === 5) {
      clearInterval(stream)
      stream = undefined
    }
  }, 300)
}
onBeforeUnmount(() => clearInterval(stream))
const feedback = ref<Record<string, 'like' | 'dislike' | null>>({})
const editing = ref<string | null>(null)
const draft = ref('')
function edit(id: string, content: string) {
  editing.value = id
  draft.value = content
}
function save(id: string) {
  const message = messages.value.find((message) => message.id === id)
  if (message && draft.value.trim()) message.content = draft.value.trim()
  editing.value = null
}
function regenerate(id: string) {
  const message = messages.value.find((message) => message.id === id)
  if (message)
    message.content =
      '本周已完成接口联调与验证；当前关注上线风险，下周优先完善监控和异常处理。'
}
</script>
<template>
  <div class="agent-demo">
    <s-message-scroller
      v-model:items="messages"
      :height="360"
      :estimated-item-height="120"
      :has-more="hasMore"
      :load-more="loadOlder"
    >
      <template #message="{ item }"
        ><s-message
          v-model:feedback="feedback[item.id]"
          :role="item.role"
          :content="item.content"
          :author="item.role === 'user' ? '我' : 'Agent'"
          @edit="edit(item.id, item.content)"
          @regenerate="regenerate(item.id)"
          ><template v-if="editing === item.id" #default>
            <div class="message-edit">
              <s-input
                v-model="draft"
                block
                aria-label="编辑消息内容"
                @keydown.enter.prevent="save(item.id)"
              />
              <div class="agent-demo-actions">
                <s-button size="small" @click="save(item.id)">保存</s-button
                ><s-button size="small" type="flat" @click="editing = null"
                  >取消</s-button
                >
              </div>
            </div>
          </template>
          <template v-if="item.role === 'user'" #avatar
            ><s-avatar :size="30" shape="circle"
              ><img
                src="/avatars/avatar-5.png"
                alt="用户头像" /></s-avatar></template></s-message
      ></template>
    </s-message-scroller>
    <div class="agent-demo-actions">
      <s-button @click="append">追加一轮对话</s-button
      ><s-button type="flat" @click="grow">继续生成回答</s-button>
    </div>
  </div>
</template>
<style scoped>
.agent-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
}
.agent-demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.message-edit {
  display: grid;
  gap: 10px;
  width: 280px;
  max-width: 100%;
  min-width: 0;
}
</style>
