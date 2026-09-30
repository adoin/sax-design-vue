<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const text = {
  launch: '打开自定义页脚示例',
  title: '自定义页脚',
  body: '页脚插槽可以调整操作区布局，同时复用 Dialog 的确认和取消流程。',
  detail: '确认会模拟一次异步处理并保持弹窗打开；取消会关闭弹窗。',
  processing: '正在处理…',
  ready: '可确认或取消',
  cancel: '取消',
  confirm: '确认',
  events: '最近事件',
  empty: '尚未触发',
}
const visible = ref(false)
const events = ref<string[]>([])
const record = (event: string) => {
  events.value = [...events.value, event].slice(-6)
}
let timer: ReturnType<typeof setTimeout> | undefined
const beforeConfirm = () =>
  new Promise<void>((resolve) => {
    timer = setTimeout(resolve, 600)
  })
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="dialog-footer-example">
    <s-button @click="visible = true">{{ text.launch }}</s-button>
    <p role="status">
      {{ text.events }}: {{ events.join(' → ') || text.empty }}
    </p>
    <s-dialog
      v-model="visible"
      :title="text.title"
      :width="480"
      show-footer
      lock-scroll
      :confirm-closable="false"
      :before-confirm="beforeConfirm"
      @confirm="record('confirm')"
      @cancel="record('cancel')"
      @closed="record('closed')"
    >
      <div class="footer-body">
        <p>{{ text.body }}</p>
        <p>{{ text.detail }}</p>
      </div>
      <template #footer="{ confirm, cancel, pending, closePending, disabled }">
        <div class="custom-footer">
          <span class="footer-status" role="status">
            {{ pending || closePending ? text.processing : text.ready }}
          </span>
          <div class="footer-actions">
            <s-button type="flat" :disabled="disabled" @click="cancel">
              {{ text.cancel }}
            </s-button>
            <s-button :loading="pending" :disabled="disabled" @click="confirm">
              {{ text.confirm }}
            </s-button>
          </div>
        </div>
      </template>
    </s-dialog>
  </div>
</template>

<style scoped>
.dialog-footer-example,
.footer-body {
  display: grid;
  gap: 16px;
}
.dialog-footer-example {
  justify-items: start;
}
.dialog-footer-example p {
  margin: 0;
  line-height: 1.6;
}
.custom-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}
.footer-status {
  flex: 1 1 160px;
  color: var(--sax-css-text-color-secondary);
  font-size: 0.85rem;
}
.footer-actions {
  display: flex;
  gap: 10px;
}
</style>
