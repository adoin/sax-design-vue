<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const text = {
  launch: 'Open custom footer example',
  title: 'Custom footer',
  body: 'Use the footer slot to arrange actions while preserving Dialog’s confirmation and cancellation flow.',
  detail:
    'Confirm simulates asynchronous processing and keeps the dialog open. Cancel closes it.',
  processing: 'Processing…',
  ready: 'Ready to confirm or cancel',
  cancel: 'Cancel',
  confirm: 'Confirm',
  events: 'Recent events',
  empty: 'None yet',
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
