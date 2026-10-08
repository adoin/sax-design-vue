<script setup lang="ts">
import { nextTick, shallowRef, useTemplateRef, watch } from 'vue'
import { IconClose, SIcon } from '@vuesax-alpha/components/icon'
import { SDialog, SFocusTrap } from 'sax-design-vue'
import { useDocLocaleUi } from '../composables/docLocale'
import ExamplePlaygroundWorkspace from './ExamplePlaygroundWorkspace.vue'
import type { DocExampleRecord } from '../type'
import type { DialogExposes } from 'sax-design-vue'

const props = defineProps<{
  example: DocExampleRecord | null
  returnFocusTo?: HTMLElement | null
}>()

const open = defineModel<boolean>('open', { required: true })
const editedSource = shallowRef('')
const minimized = shallowRef(false)
const dialogInstance = useTemplateRef<DialogExposes>('dialogInstance')
const dialogRef = useTemplateRef<HTMLElement>('dialog')
const closeButtonRef = useTemplateRef<HTMLButtonElement>('closeButton')
const { t } = useDocLocaleUi()

watch(
  () => [open.value, props.example] as const,
  ([isOpen, example]) => {
    if (!isOpen) minimized.value = false
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
    ref="dialogInstance"
    v-model="open"
    full-screen
    :minimized-label="`${t.examples.playground}: ${example?.title || ''}`"
    lock-scroll
    not-close
    not-padding
    overlay-blur
    :mask-closable="false"
    @opened="focusCloseButton"
    @closed="restoreTriggerFocus"
    @minimize="minimized = true"
    @restore="minimized = false"
  >
    <SFocusTrap
      :trapped="open && !minimized"
      :loop="true"
      :focus-trap-el="dialogRef || undefined"
    >
      <section
        v-if="example"
        ref="dialog"
        class="example-playground-dialog"
        tabindex="-1"
      >
        <ExamplePlaygroundWorkspace v-model="editedSource" :example="example">
          <template #actions>
            <div class="example-playground-dialog__controls">
              <button
                class="example-playground-dialog__control"
                type="button"
                :title="t.examples.minimizePlayground"
                :aria-label="t.examples.minimizePlayground"
                @click="dialogInstance?.minimize()"
              >
                <SIcon name="bx:minus" size="1em" />
              </button>
              <button
                ref="closeButton"
                class="example-playground-dialog__control example-playground-dialog__close"
                type="button"
                :title="t.examples.closePlayground"
                :aria-label="t.examples.closePlayground"
                @click="close"
              >
                <IconClose size="1em" />
              </button>
            </div>
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

.example-playground-dialog__controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.example-playground-dialog__control {
  display: inline-grid;
  width: 44px;
  height: 44px;
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

.example-playground-dialog__control:hover,
.example-playground-dialog__control:focus-visible {
  background: hsl(var(--sax-accent-color) / 0.12);
  color: hsl(var(--sax-accent-color));
  outline: none;
}

.example-playground-dialog__close:hover,
.example-playground-dialog__close:focus-visible {
  background: hsl(var(--sax-danger) / 0.12);
  color: hsl(var(--sax-danger));
}

.example-playground-dialog__close:focus-visible {
  outline: none;
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

  // Playground owns one toolbar and invokes the dialog's exposed minimize API.
  // Keep the dialog capability while replacing its floating action placement.
  .s-dialog__minimize {
    display: none;
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
