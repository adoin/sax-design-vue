<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SFocusTrap } from '@vuesax-alpha/components/focus-trap'
import { useNamespace, useShape } from '@vuesax-alpha/hooks'
import { contextMenuEmits, contextMenuProps } from './context-menu'
import type { ContextMenuItem } from './context-menu'
import type { PopperInstance } from '@vuesax-alpha/components/popper'

defineOptions({ name: 'SContextMenu' })
const props = defineProps(contextMenuProps)
const emit = defineEmits(contextMenuEmits)
const ns = useNamespace('context-menu')
const shape = useShape()
const triggerRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const popper = ref<PopperInstance>()
const open = shallowRef(props.modelValue)
const reference = shallowRef<{
  getBoundingClientRect: () => DOMRect
  contextElement?: Element
}>({ getBoundingClientRect: () => new DOMRect(0, 0, 0, 0) })
let origin: HTMLElement | undefined
let sequence = 0
let pendingRestore: { request: number; target: HTMLElement } | undefined
const enabledItems = () => [
  ...(menuRef.value?.querySelectorAll<HTMLButtonElement>(
    '[role="menuitem"]:not(:disabled)',
  ) ?? []),
]
const focusMenu = () =>
  nextTick(() => {
    if (open.value)
      (enabledItems()[0] ?? menuRef.value)?.focus({ preventScroll: true })
  })
const setOpen = (value: boolean) => {
  if (open.value === value) return
  open.value = value
  emit('update:modelValue', value)
  if (!value) {
    sequence++
    emit('close')
  }
}
const close = (restore = true) => {
  const shouldRestore =
    restore &&
    menuRef.value?.contains(menuRef.value.ownerDocument.activeElement)
  setOpen(false)
  pendingRestore =
    shouldRestore && origin ? { request: sequence, target: origin } : undefined
}
const onHidden = () => {
  const pending = pendingRestore
  pendingRestore = undefined
  if (
    pending &&
    pending.request === sequence &&
    !open.value &&
    pending.target.isConnected
  )
    pending.target.focus({ preventScroll: true })
}
const show = async (
  event: MouseEvent | KeyboardEvent,
  target?: HTMLElement,
) => {
  if (props.disabled || event.defaultPrevented) return false
  const keyboard = event instanceof KeyboardEvent
  if (
    keyboard &&
    (event.isComposing ||
      event.keyCode === 229 ||
      !(event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)))
  )
    return false
  const anchor =
    target ??
    (event.target instanceof HTMLElement ? event.target : triggerRef.value)
  if (!anchor) return false
  pendingRestore = undefined
  event.preventDefault()
  event.stopPropagation()
  origin =
    target ??
    (anchor.closest<HTMLElement>('button,a[href],input,[tabindex]') ||
      triggerRef.value ||
      anchor)
  const rect = anchor.getBoundingClientRect()
  const x = keyboard ? rect.left : event.clientX
  const y = keyboard ? rect.bottom : event.clientY
  reference.value = {
    contextElement: anchor,
    getBoundingClientRect: () => {
      const current = anchor.getBoundingClientRect()
      return new DOMRect(
        x + current.left - rect.left,
        y + current.top - rect.top,
        0,
        0,
      )
    },
  }
  const request = ++sequence
  setOpen(true)
  emit('open', event)
  await nextTick()
  if (request !== sequence || !open.value) return false
  popper.value?.updatePopper()
  ;(enabledItems()[0] ?? menuRef.value)?.focus({ preventScroll: true })
  return true
}
const select = (item: ContextMenuItem) => {
  if (item.disabled) return
  emit('select', item)
  if (!item.keepOpen) close()
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || event.isComposing || event.keyCode === 229)
    return
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    close()
    return
  }
  if (event.key === 'Tab') {
    close()
    return
  }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  event.stopPropagation()
  const items = enabledItems()
  const index = items.indexOf(event.target as HTMLButtonElement)
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) %
          items.length
  items[next]?.focus()
}
watch(
  () => props.modelValue,
  (value) => {
    if (value) setOpen(true)
    else close(false)
  },
)
watch(
  () => props.disabled,
  (value) => {
    if (value) close()
  },
)
watch(
  () => props.items,
  async () => {
    const owned = menuRef.value?.contains(
      menuRef.value.ownerDocument.activeElement,
    )
    await nextTick()
    if (!open.value || !owned || !menuRef.value) return
    const active = menuRef.value.ownerDocument.activeElement
    if (
      active === menuRef.value.ownerDocument.body ||
      active?.matches(':disabled')
    )
      (enabledItems()[0] ?? menuRef.value).focus({ preventScroll: true })
  },
  { deep: true },
)
onBeforeUnmount(() => {
  sequence++
  pendingRestore = undefined
})
defineExpose({ show, close })
</script>

<template>
  <span
    v-if="$slots.default"
    ref="triggerRef"
    :class="ns.b()"
    :tabindex="disabled ? undefined : 0"
    @contextmenu="show($event)"
    @keydown="show($event)"
  >
    <slot />
  </span>
  <SPopper
    ref="popper"
    :visible="open"
    virtual-triggering
    :virtual-ref="reference"
    :trigger="[]"
    :disabled="disabled"
    placement="bottom-start"
    strategy="fixed"
    :show-arrow="false"
    :offset="0"
    :flip="{ padding: 8 }"
    :shift="{ padding: 8 }"
    :popper-class="ns.e('popper')"
    @update:visible="setOpen"
    @hide="onHidden"
  >
    <template #content>
      <SFocusTrap
        :trapped="open"
        :focus-trap-el="menuRef"
        @focus-after-trapped.prevent="focusMenu"
        @focus-after-released.prevent
        @focusout-prevented.prevent
      >
        <div
          ref="menuRef"
          :class="[ns.e('panel'), ns.is('square', shape === 'square')]"
          :style="{ minWidth: `min(${minWidth}px, calc(100vw - 16px))` }"
          role="menu"
          tabindex="-1"
          @contextmenu.prevent
          @keydown="onKeydown"
        >
          <button
            v-for="(item, index) in items"
            :key="item.value ?? `${item.label}-${index}`"
            :class="[ns.e('item'), { 'is-divided': item.divided }]"
            type="button"
            role="menuitem"
            tabindex="-1"
            :disabled="item.disabled"
            @click="select(item)"
          >
            <SIcon v-if="item.icon" :name="item.icon" />
            <span>{{ item.label }}</span>
          </button>
          <slot name="menu" :close="close" />
        </div>
      </SFocusTrap>
    </template>
  </SPopper>
</template>
