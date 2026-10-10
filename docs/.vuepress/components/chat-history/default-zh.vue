<script setup lang="ts">
import { ref, useId } from 'vue'
import type { AgentHistoryMessage } from 'sax-design-vue'
const historyId = useId()
const open = ref(false)
const activeId = ref('')
const messages: AgentHistoryMessage[] = [
  {
    id: '1',
    role: 'user',
    content: '这周客户门户做得怎么样？',
  },
  {
    id: '2',
    role: 'assistant',
    content:
      '本周完成登录改版与单点登录接入，灰度覆盖 30% 用户。登录成功率从 96.8% 提升到 99.2%，客服工单减少 18%。团队已补齐异常监控，后续将继续跟踪转化与错误率。',
  },
  {
    id: '3',
    role: 'user',
    content: '发布还有哪些风险？',
  },
  {
    id: '4',
    role: 'assistant',
    content:
      '12 家企业客户仍使用旧权限模型。客户成功团队正在核对账号映射，研发将提供迁移校验工具；扩大灰度前会完成联合验收，避免权限缺失影响业务。',
  },
  {
    id: '5',
    role: 'user',
    content: '下周具体安排是什么？',
  },
  {
    id: '6',
    role: 'assistant',
    content:
      '周三前完成权限迁移校验，随后将灰度从 30% 扩大到 60%。周五汇总登录数据、告警和客户反馈，形成全量发布建议，并同步给业务负责人。',
  },
  {
    id: '7',
    role: 'user',
    content: '帮我整理一段管理层摘要。',
  },
  {
    id: '8',
    role: 'assistant',
    content:
      '本周客户门户登录改版取得阶段性成果：成功率达到 99.2%，工单下降 18%。下周重点是完成权限迁移、验证扩大灰度后的稳定性，并在周五提交发布结论。',
  },
]
function locate(message: AgentHistoryMessage) {
  activeId.value = message.id
}
</script>

<template>
  <div class="agent-demo">
    <s-chat-history
      v-model="open"
      :messages="messages"
      :active-id="activeId"
      @select="locate"
    >
      <s-message-scroller :height="320" :auto-follow="false"
        ><s-message
          v-for="message in messages"
          :id="historyId + '-' + message.id"
          :key="message.id"
          :data-message-id="message.id"
          :role="message.role"
          :content="message.content"
          :actions="false"
      /></s-message-scroller>
    </s-chat-history>
  </div>
</template>

<style scoped>
.agent-demo {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  min-width: 0;
}
.agent-demo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
