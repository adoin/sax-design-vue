<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import type {
  DialogBeforeCloseFn,
  FormInstance,
  FormItemConfig,
} from 'sax-design-vue'

const text = {
  launch: 'Try the publishing workflow',
  title: 'Publish workspace update',
  lead: 'Publish a short update for everyone in your workspace.',
  name: 'Update title',
  namePlaceholder: 'For example: September improvements',
  nameRequired: 'Enter an update title',
  notes: 'Release notes',
  notesPlaceholder: 'Describe what changed and who it affects',
  notesRequired: 'Add release notes before publishing',
  simulation:
    'Local request simulation: the first request fails; retrying succeeds.',
  errorTitle: 'Publishing failed',
  failure:
    'The service is temporarily unavailable. Your draft is preserved; please retry.',
  closeBusy:
    'Publishing is in progress. Wait for the request to finish before closing.',
  discardTitle: 'Unsaved draft',
  discardText: 'Closing will discard your update title and release notes.',
  kept: 'Your draft is preserved. Continue editing.',
  keep: 'Keep editing',
  discard: 'Discard and close',
  pending: 'Validating and publishing…',
  idle: 'Your draft stays here until publishing succeeds.',
  cancel: 'Cancel',
  publish: 'Publish update',
  retry: 'Retry publishing',
  success: 'Published update:',
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
// Replace this local simulation with the application's API request.
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
