<script setup lang="ts">
import { nextTick, shallowRef, useTemplateRef, watch } from 'vue'
import { SDialog, SFocusTrap } from 'sax-design-vue'
import { useDocLocaleUi } from '../composables/docLocale'
import ExamplePlaygroundWorkspace from './ExamplePlaygroundWorkspace.vue'
import type { DocExampleRecord } from '../type'

const props = defineProps<{
  example: DocExampleRecord | null
  returnFocusTo?: HTMLElement | null
}>()

const open = defineModel<boolean>('open', { required: true })
const editedSource = shallowRef('')
const dialogRef = useTemplateRef<HTMLElement>('dialog')
const closeButtonRef = useTemplateRef<HTMLButtonElement>('closeButton')
const { t } = useDocLocaleUi()

watch(
  () => [open.value, props.example] as const,
  ([isOpen, example]) => {
    if (isOpen && example) editedSource.value = example.source
  },
  { immediate: true },
)

const close = () => {
  open.value = false
}

const focusCloseButton = () => {
  closeButtonRef.value?.focus()
}

const restoreTriggerFocus = async () => {
  await nextTick()
  props.returnFocusTo?.focus()
}
</script>

<template>
  <SDialog
    v-model="open"
    full-screen
    lock-scroll
    not-close
    not-padding
    overlay-blur
    :mask-closable="false"
    @opened="focusCloseButton"
    @closed="restoreTriggerFocus"
  >
    <SFocusTrap
      :trapped="open"
      :loop="true"
      :focus-trap-el="dialogRef || undefined"
    >
      <section
        v-if="example"
        ref="dialog"
        class="example-playground-dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="`${t.examples.playground}: ${example.title}`"
        tabindex="-1"
      >
        <ExamplePlaygroundWorkspace v-model="editedSource" :example="example">
          <template #actions>
            <button
              ref="closeButton"
              class="example-playground-dialog__close"
              type="button"
              :title="t.examples.closePlayground"
              :aria-label="t.examples.closePlayground"
              @click="close"
            >
              <s-icon name="bx:x" />
            </button>
          </template>
        </ExamplePlaygroundWorkspace>
      </section>
    </SFocusTrap>
  </SDialog>
</template>

<style lang="scss" scoped>
.example-playground-dialog {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
}

.example-playground-dialog__close {
  display: inline-grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 9px;
  background: hsl(var(--sax-theme-bg2) / 0.48);
  color: hsl(var(--sax-theme-color) / 0.68);
  font: inherit;
  cursor: pointer;
}

.example-playground-dialog__close:hover,
.example-playground-dialog__close:focus-visible {
  background: hsl(var(--sax-danger) / 0.12);
  color: hsl(var(--sax-danger));
}

.example-playground-dialog__close:focus-visible {
  outline: 2px solid hsl(var(--sax-danger) / 0.36);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .example-playground-dialog,
  .example-playground-dialog__close {
    transition: none !important;
  }
}
</style>

<style lang="scss">
.s-dialog.is-full-screen:has(.example-playground-dialog) {
  padding: 16px;
  background: rgba(18, 16, 45, 0.38);

  > .s-dialog-original {
    width: min(1480px, 100%) !important;
    height: min(920px, 100%) !important;
    overflow: hidden;
    border-radius: 20px;
    background: hsl(var(--sax-theme-layout));
    box-shadow: 0 28px 80px rgba(20, 16, 62, 0.32);
  }

  .s-dialog__content {
    height: 100%;
  }
}

@media (max-width: 560px) {
  .s-dialog.is-full-screen:has(.example-playground-dialog) {
    padding: 0;

    > .s-dialog-original {
      width: 100% !important;
      height: 100% !important;
      min-width: 0;
      margin: 0;
      border-radius: 0;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .s-dialog:has(.example-playground-dialog),
  .s-dialog:has(.example-playground-dialog) .s-dialog-original {
    animation: none !important;
    transition: none !important;
  }
}
</style>
