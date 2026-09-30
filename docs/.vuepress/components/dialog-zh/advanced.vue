<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import type {
  DialogBeforeCloseFn,
  FormInstance,
  FormItemConfig,
} from 'sax-design-vue'

const text = {
  launch: '体验发布流程',
  title: '发布工作区更新',
  lead: '填写更新内容，发布后供工作区成员查看。',
  name: '更新标题',
  namePlaceholder: '例如：九月功能更新',
  nameRequired: '请输入更新标题',
  notes: '更新说明',
  notesPlaceholder: '说明本次更新内容及影响范围',
  notesRequired: '请填写更新说明后再发布',
  simulation: '本地模拟请求：首次失败，重试后成功。',
  errorTitle: '发布未完成',
  failure: '服务暂时不可用，草稿已保留，请重试发布。',
  closeBusy: '正在发布，请等待请求结束后再关闭。',
  discardTitle: '有未保存的草稿',
  discardText: '关闭将放弃已填写的标题和更新说明。',
  kept: '草稿已保留，请继续编辑。',
  keep: '继续编辑',
  discard: '放弃并关闭',
  pending: '正在校验并发布…',
  idle: '发布成功前，填写内容会保留在这里。',
  cancel: '取消',
  publish: '发布更新',
  retry: '重试发布',
  success: '已发布更新：',
}
const visible = ref(false)
const form = ref<FormInstance>()
const model = reactive({ name: '', notes: '' })
const submitting = ref(false)
const accepted = ref(false)
const error = ref('')
const discardVisible = ref(false)
const publishedName = ref('')
let attempts = 0
let request: AbortController | undefined
let pendingClose:
  { resolve: () => void; reject: (reason: unknown) => void } | undefined
const dirty = computed(
  () => Boolean(model.name || model.notes) && !accepted.value,
)
const items: FormItemConfig[] = [
  {
    field: 'name',
    title: text.name,
    rules: { required: true, message: text.nameRequired },
    itemRender: {
      name: '$input',
      props: { placeholder: text.namePlaceholder },
    },
  },
  {
    field: 'notes',
    title: text.notes,
    rules: { required: true, message: text.notesRequired },
    itemRender: {
      name: '$textarea',
      props: { placeholder: text.notesPlaceholder, rows: 3, resize: 'none' },
    },
  },
]
const open = () => {
  Object.assign(model, { name: '', notes: '' })
  attempts = 0
  accepted.value = false
  error.value = ''
  discardVisible.value = false
  pendingClose = undefined
  visible.value = true
}
// 在业务项目中替换为实际的接口请求。
const publish = (fail: boolean, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort)
      if (fail) reject(new Error(text.failure))
      else resolve()
    }, 900)
    signal.addEventListener('abort', abort, { once: true })
  })
const beforeConfirm = async () => {
  error.value = ''
  if (!(await form.value?.validate())) return false
  const controller = new AbortController()
  request = controller
  submitting.value = true
  try {
    await publish(++attempts === 1, controller.signal)
    accepted.value = true
  } finally {
    submitting.value = false
    request = undefined
  }
}
const beforeClose: DialogBeforeCloseFn = () => {
  if (submitting.value) return Promise.reject(text.closeBusy)
  if (dirty.value) {
    discardVisible.value = true
    return new Promise<void>((resolve, reject) => {
      pendingClose = { resolve, reject }
    })
  }
  return Promise.resolve()
}
const keepEditing = () => {
  const pending = pendingClose
  pendingClose = undefined
  discardVisible.value = false
  pending?.reject(text.kept)
}
const discard = () => {
  const pending = pendingClose
  pendingClose = undefined
  discardVisible.value = false
  pending?.resolve()
}
const confirmed = () => {
  publishedName.value = model.name
}
const failed = (reason: unknown) => {
  error.value = reason instanceof Error ? reason.message : text.failure
}
onBeforeUnmount(() => {
  request?.abort()
  pendingClose?.reject(new DOMException('Aborted', 'AbortError'))
  pendingClose = undefined
})
</script>

<template>
  <div class="dialog-workflow-example">
    <s-button @click="open">{{ text.launch }}</s-button>
    <p v-if="publishedName" role="status">
      {{ text.success }} {{ publishedName }}
    </p>
    <s-dialog
      v-model="visible"
      :title="text.title"
      :width="560"
      lock-scroll
      show-footer
      :confirm-disabled="discardVisible"
      :before-confirm="beforeConfirm"
      :before-close="beforeClose"
      @confirm="confirmed"
      @confirm-error="failed"
      @closed="keepEditing"
    >
      <div class="workflow-body">
        <p class="workflow-lead">{{ text.lead }}</p>
        <s-form
          ref="form"
          :model="model"
          :items="items"
          label-position="top"
          :disabled="submitting || discardVisible"
        />
        <s-alert v-if="error" color="danger" type="flat" role="alert">
          <template #title>{{ text.errorTitle }}</template>
          {{ error }}
        </s-alert>
        <s-alert v-if="discardVisible" color="warn" type="flat" role="alert">
          <template #title>{{ text.discardTitle }}</template>
          <p>{{ text.discardText }}</p>
          <div class="workflow-actions">
            <s-button type="flat" @click="keepEditing">{{
              text.keep
            }}</s-button>
            <s-button color="danger" @click="discard">{{
              text.discard
            }}</s-button>
          </div>
        </s-alert>
        <p class="workflow-note">{{ text.simulation }}</p>
      </div>
      <template #footer="{ confirm, cancel, pending, closePending, disabled }">
        <div class="workflow-footer">
          <span class="workflow-footer-note" role="status">{{
            pending ? text.pending : text.idle
          }}</span>
          <div class="workflow-actions">
            <s-button
              type="flat"
              :disabled="pending || closePending"
              @click="cancel"
              >{{ text.cancel }}</s-button
            >
            <s-button
              :loading="pending"
              :disabled="disabled"
              @click="confirm"
              >{{ error ? text.retry : text.publish }}</s-button
            >
          </div>
        </div>
      </template>
    </s-dialog>
  </div>
</template>

<style scoped>
.dialog-workflow-example,
.workflow-body {
  display: grid;
  gap: 16px;
}
.dialog-workflow-example {
  justify-items: start;
}
.dialog-workflow-example p {
  margin: 0;
}
.workflow-lead {
  line-height: 1.6;
}
.workflow-note,
.workflow-footer-note {
  color: var(--sax-css-text-color-secondary);
  font-size: 0.8rem;
  line-height: 1.5;
}
.workflow-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}
.workflow-footer-note {
  flex: 1 1 180px;
}
.workflow-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}
.workflow-body :deep(.s-alert p) {
  margin: 0 0 12px;
}
</style>
