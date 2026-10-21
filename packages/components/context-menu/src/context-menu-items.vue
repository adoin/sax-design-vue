<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, shallowRef } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import { useShape } from '@vuesax-alpha/hooks'
import type { ContextMenuItem } from './context-menu'

defineOptions({ name: 'SContextMenuItems' })
const props = defineProps<{
  items: ContextMenuItem[]
  minWidth: number
  nested?: boolean
}>()
const emit = defineEmits<{
  select: [item: ContextMenuItem]
  dismiss: []
  back: []
  activity: [inside: boolean]
}>()
const shape = useShape()
const expanded = shallowRef<number>()
const panel = ref<HTMLElement>()
const buttons: (HTMLButtonElement | null)[] = []
let hideTimer: ReturnType<typeof setTimeout> | undefined
const cancelHide = () => {
  clearTimeout(hideTimer)
  hideTimer = undefined
}
const hover = (index: number) => {
  cancelHide()
  expanded.value = props.items[index]?.disabled ? undefined : index
}
const scheduleHide = () => {
  cancelHide()
  hideTimer = setTimeout(() => {
    if (panel.value?.contains(panel.value.ownerDocument.activeElement)) return
    expanded.value = undefined
  }, 180)
}
const panelEnter = () => {
  cancelHide()
  emit('activity', true)
}
const panelLeave = () => {
  scheduleHide()
  emit('activity', false)
}
const childActivity = (inside: boolean) => {
  if (inside) cancelHide()
  else scheduleHide()
  emit('activity', inside)
}
const restore = (index: number) => {
  cancelHide()
  expanded.value = undefined
  buttons[index]?.focus({ preventScroll: true })
}
const selectChild = (index: number, item: ContextMenuItem) => {
  restore(index)
  emit('select', item)
}
const dismissChild = (index: number) => {
  restore(index)
  emit('dismiss')
}
const enter = async (index: number) => {
  hover(index)
  await nextTick()
  panel.value
    ?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')
    ?.focus()
}
const activate = (item: ContextMenuItem, index: number) => {
  if (item.disabled) return
  if (item.children?.length) enter(index)
  else emit('select', item)
}
const keydown = (event: KeyboardEvent, index: number) => {
  if (event.defaultPrevented || event.isComposing || event.keyCode === 229)
    return
  if (event.key === 'ArrowRight' && props.items[index]?.children?.length) {
    event.preventDefault()
    event.stopPropagation()
    enter(index)
  } else if (
    event.key === 'Escape' ||
    (event.key === 'ArrowLeft' && props.nested)
  ) {
    event.preventDefault()
    event.stopPropagation()
    if (props.nested) emit('back')
    else emit('dismiss')
  } else if (event.key === 'Tab') {
    event.stopPropagation()
    emit('dismiss')
  } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    event.stopPropagation()
    const enabled = buttons.filter(
      (button): button is HTMLButtonElement =>
        !!button && !button.disabled && button.isConnected,
    )
    const current = enabled.indexOf(buttons[index]!)
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? enabled.length - 1
          : (current + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) %
            enabled.length
    expanded.value = undefined
    enabled[next]?.focus()
  }
}
onBeforeUnmount(cancelHide)
</script>

<template>
  <div class="s-context-menu__items">
    <template
      v-for="(item, index) in items"
      :key="item.value ?? `${item.label}-${index}`"
    >
      <SPopper
        v-if="item.children?.length"
        :visible="expanded === index && !item.disabled"
        :trigger="[]"
        placement="right-start"
        strategy="fixed"
        :show-arrow="false"
        :offset="2"
        :flip="{ padding: 8 }"
        :shift="{ padding: 8 }"
        popper-class="s-context-menu__popper"
        @update:visible="!$event && (expanded = undefined)"
      >
        <button
          :ref="
            (el) => {
              buttons[index] = el as HTMLButtonElement | null
            }
          "
          class="s-context-menu__item"
          :class="{ 'is-divided': item.divided }"
          type="button"
          role="menuitem"
          tabindex="-1"
          aria-haspopup="menu"
          :aria-expanded="expanded === index"
          :disabled="item.disabled"
          @mouseenter="hover(index)"
          @mouseleave="scheduleHide"
          @click="activate(item, index)"
          @keydown="keydown($event, index)"
        >
          <SIcon v-if="item.icon" :name="item.icon" />
          <span>{{ item.label }}</span>
          <svg
            class="s-context-menu__submenu-arrow"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path
              d="m6 3 5 5-5 5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <template #content>
          <div
            v-if="expanded === index"
            :ref="
              (el) => {
                if (el) panel = el as HTMLElement
              }
            "
            class="s-context-menu__panel"
            :class="{ 'is-square': shape === 'square' }"
            :style="{ minWidth: `min(${minWidth}px, calc(100vw - 16px))` }"
            role="menu"
            :aria-label="item.label"
            @mouseenter="panelEnter"
            @mouseleave="panelLeave"
            @contextmenu.prevent
          >
            <SContextMenuItems
              :items="item.children"
              :min-width="minWidth"
              nested
              @activity="childActivity"
              @back="restore(index)"
              @select="selectChild(index, $event)"
              @dismiss="dismissChild(index)"
            />
          </div>
        </template>
      </SPopper>
      <button
        v-else
        :ref="
          (el) => {
            buttons[index] = el as HTMLButtonElement | null
          }
        "
        class="s-context-menu__item"
        :class="{ 'is-divided': item.divided }"
        type="button"
        role="menuitem"
        tabindex="-1"
        :disabled="item.disabled"
        @mouseenter="hover(index)"
        @click="activate(item, index)"
        @keydown="keydown($event, index)"
      >
        <SIcon v-if="item.icon" :name="item.icon" />
        <span>{{ item.label }}</span>
      </button>
    </template>
  </div>
</template>
