<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'
import type { NoticeBarBeforeCloseFn, NoticeBarInstance } from 'sax-design-vue'

const storageKey = 'sax-notice-before-close-example-en'
const notice = useTemplateRef<NoticeBarInstance>('notice')
const visible = shallowRef(true)
const permanent = shallowRef(false)
const decisionOpen = shallowRef(false)
const storageError = shallowRef('')
let choice: 'temporary' | 'permanent' | undefined
let decision:
  { resolve: () => void; reject: (reason: Error) => void } | undefined

const beforeClose: NoticeBarBeforeCloseFn = () =>
  new Promise<void>((resolve, reject) => {
    choice = undefined
    storageError.value = ''
    decision = { resolve, reject }
    decisionOpen.value = true
  })

const choose = (value: 'temporary' | 'permanent') => {
  if (value === 'permanent') {
    try {
      localStorage.setItem(storageKey, 'closed')
      permanent.value = true
    } catch {
      storageError.value =
        'Unable to save the preference. You can still close this time.'
      return
    }
  }
  choice = value
  decisionOpen.value = false
}
const finishDecision = () => {
  const pending = decision
  decision = undefined
  if (choice) pending?.resolve()
  else pending?.reject(new Error('Dismissal canceled'))
}
const reset = () => {
  try {
    localStorage.removeItem(storageKey)
    permanent.value = false
    visible.value = true
  } catch {
    storageError.value = 'Unable to reset the saved preference.'
  }
}
onMounted(() => {
  try {
    permanent.value = localStorage.getItem(storageKey) === 'closed'
    visible.value = !permanent.value
  } catch {
    permanent.value = false
  }
})
onBeforeUnmount(() => {
  decision?.reject(new Error('Example disposed'))
  decision = undefined
})
</script>

<template>
  <div class="notice-close-demo">
    <s-button size="small" flat :disabled="notice?.closePending" @click="reset">
      Reset preference and show
    </s-button>
    <s-notice-bar
      ref="notice"
      v-model="visible"
      content="Workspace tips are available. Click close to choose how to dismiss this notice."
      closable
      :before-close="beforeClose"
    />
    <span role="status">
      {{
        permanent
          ? 'Permanently closed: stays hidden after reload.'
          : visible
            ? 'Notice is visible.'
            : 'Closed this time: returns after reload.'
      }}
    </span>
    <s-dialog
      v-model="decisionOpen"
      title="How would you like to close this notice?"
      :width="460"
      show-footer
      :mask-closable="false"
      @closed="finishDecision"
    >
      <p>
        Close this time to see it again after reload, or save a permanent
        preference in this browser.
      </p>
      <p v-if="storageError" role="alert">{{ storageError }}</p>
      <template #footer>
        <div class="notice-close-demo__actions">
          <s-button flat @click="decisionOpen = false">Keep visible</s-button>
          <s-button flat @click="choose('temporary')">Close this time</s-button>
          <s-button @click="choose('permanent')">Close permanently</s-button>
        </div>
      </template>
    </s-dialog>
    <p v-if="storageError && !decisionOpen" role="alert">{{ storageError }}</p>
  </div>
</template>

<style scoped>
.notice-close-demo {
  display: grid;
  justify-items: start;
  gap: 16px;
  width: 100%;
}
.notice-close-demo__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}
.notice-close-demo p {
  margin: 0;
  line-height: 1.6;
}
</style>
