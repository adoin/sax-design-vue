<script lang="ts" setup>
import { computed, inject, nextTick, onBeforeUnmount } from 'vue'
import { SPopper } from '@vuesax-alpha/components/popper'
import { STooltip } from '@vuesax-alpha/components/tooltip'
import { useId, useNamespace } from '@vuesax-alpha/hooks'
import SMenuNodeControl from './menu-node-control.vue'
import SMenuPopupPanel from './menu-popup-panel.vue'
import { menuContextKey } from './menu-context'

import type { MenuOption } from './menu'

defineOptions({ name: 'SMenuNode' })

const props = defineProps<{
  option: MenuOption
  level: number
  parent?: MenuOption
}>()

const ns = useNamespace('menu-node')
const context = inject(menuContextKey)

if (!context) {
  throw new Error('[SMenuNode] must be used inside SMenu')
}

const {
  current,
  openKeys,
  mode,
  submenuMode,
  trigger,
  collapse,
  selectableParents,
  teleported,
  showDelay,
  hideDelay,
  popupOffset,
  popupClass,
  select,
  setOpen,
} = context

const submenuId = useId()
const hasChildren = computed(() => !!props.option.children?.length)
const active = computed(() => props.option.key === current.value)
const isOpen = computed(() => openKeys.value.includes(props.option.key))
const isDivider = computed(() => props.option.type === 'divider')
const isGroup = computed(() => props.option.type === 'group')
const isPopup = computed(
  () =>
    hasChildren.value &&
    (mode.value === 'horizontal' ||
      collapse.value ||
      submenuMode.value === 'popup'),
)
const isHorizontalRoot = computed(
  () => mode.value === 'horizontal' && props.level === 0,
)
const isCurrentBranch = computed(() => {
  const contains = (items: MenuOption[] = []): boolean =>
    items.some(
      (item) =>
        item.key === current.value ||
        (item.children && contains(item.children)),
    )
  return contains(props.option.children)
})
const popupPlacement = computed(() =>
  props.level === 0 && mode.value === 'horizontal' ? 'bottom' : 'right-start',
)
const popupTeleported = computed(() => props.level === 0 && teleported.value)
const popupClasses = computed(() => [
  's-menu-popup',
  `s-menu-popup--level-${props.level}`,
  isHorizontalRoot.value
    ? 's-menu-popup--horizontal-root'
    : 's-menu-popup--cascade',
  ...(popupClass.value ? [popupClass.value] : []),
])

let openTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined

const clearPopupTimers = () => {
  if (openTimer !== undefined) clearTimeout(openTimer)
  if (closeTimer !== undefined) clearTimeout(closeTimer)
  openTimer = undefined
  closeTimer = undefined
}

const openFromHover = () => {
  if (trigger.value !== 'hover' || props.option.disabled) return
  clearPopupTimers()
  openTimer = setTimeout(() => setOpen(props.option, true), showDelay.value)
}

const closeFromHover = () => {
  if (trigger.value !== 'hover' || props.option.disabled) return
  clearPopupTimers()
  closeTimer = setTimeout(() => setOpen(props.option, false), hideDelay.value)
}

onBeforeUnmount(clearPopupTimers)

const activate = () => {
  if (props.option.disabled) return
  if (hasChildren.value) {
    if (!isPopup.value || trigger.value === 'click') {
      setOpen(props.option, !isOpen.value)
    }
    if (!selectableParents.value) return
  }
  select(props.option)
}

const focusFirstChild = async () => {
  await nextTick()
  const first = document.querySelector<HTMLElement>(
    `#${submenuId.value} .s-menu-node__button:not([disabled])`,
  )
  first?.focus()
}

const focusSibling = (
  event: KeyboardEvent,
  target: 'next' | 'previous' | 'first' | 'last',
) => {
  const control = event.currentTarget as HTMLElement
  const list = control.closest('ul')
  if (!list) return
  const controls = Array.from(
    list.querySelectorAll<HTMLElement>(
      ':scope > .s-menu-node > .s-menu-node__button',
    ),
  ).filter(
    (item) =>
      !item.hasAttribute('disabled') &&
      item.getAttribute('aria-disabled') !== 'true',
  )
  const index = controls.indexOf(control)
  if (index < 0 || !controls.length) return

  let nextIndex = index
  if (target === 'next') nextIndex = (index + 1) % controls.length
  if (target === 'previous')
    nextIndex = (index - 1 + controls.length) % controls.length
  if (target === 'first') nextIndex = 0
  if (target === 'last') nextIndex = controls.length - 1
  event.preventDefault()
  controls[nextIndex]?.focus()
}

const closeCurrentBranch = (event: KeyboardEvent) => {
  const branch = isOpen.value ? props.option : props.parent
  if (!branch) return false

  event.preventDefault()
  const listId = (event.target as HTMLElement).closest('ul')?.id
  const parentControl = listId
    ? document.querySelector<HTMLElement>(`[aria-controls="${listId}"]`)
    : undefined
  setOpen(branch, false)
  nextTick(() => setTimeout(() => parentControl?.focus(), 0))
  return true
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && closeCurrentBranch(event)) return
  if (event.key === 'Home') return focusSibling(event, 'first')
  if (event.key === 'End') return focusSibling(event, 'last')

  if (mode.value === 'horizontal' && props.level === 0) {
    if (event.key === 'ArrowRight') return focusSibling(event, 'next')
    if (event.key === 'ArrowLeft') return focusSibling(event, 'previous')
    if (event.key === 'ArrowDown' && hasChildren.value) {
      event.preventDefault()
      setOpen(props.option, true)
      focusFirstChild()
    }
    return
  }

  if (event.key === 'ArrowDown') return focusSibling(event, 'next')
  if (event.key === 'ArrowUp') return focusSibling(event, 'previous')
  if (event.key === 'ArrowLeft' && props.level > 0) {
    closeCurrentBranch(event)
    return
  }
  if (event.key === 'ArrowRight' && hasChildren.value) {
    event.preventDefault()
    setOpen(props.option, true)
    focusFirstChild()
  }
}
</script>

<template>
  <li
    v-if="isDivider"
    :class="[ns.b(), ns.is('divider')]"
    role="presentation"
  />

  <li v-else-if="isGroup" :class="[ns.b(), ns.is('group')]" :data-level="level">
    <div :class="ns.e('group-label')">{{ option.label }}</div>
    <ul :class="[ns.e('children'), ns.is('group-list')]">
      <SMenuNode
        v-for="item in option.children"
        :key="item.key"
        :option="item"
        :level="level + 1"
        :parent="parent"
      />
    </ul>
  </li>

  <li
    v-else
    :class="[
      ns.b(),
      ns.is('open', isOpen),
      ns.is('active', active),
      ns.is('current-path', isCurrentBranch),
      ns.is('disabled', option.disabled),
      ns.is('has-children', hasChildren),
      ns.is('popup', isPopup),
      ns.is('horizontal-root', isHorizontalRoot),
    ]"
    :data-level="level"
  >
    <SPopper
      v-if="hasChildren && isPopup"
      :visible="isOpen"
      :trigger="trigger"
      :placement="popupPlacement"
      :teleported="popupTeleported"
      :show-after="showDelay"
      :hide-after="hideDelay"
      :offset="popupOffset"
      :show-arrow="false"
      :popper-class="popupClasses"
      animation="s-menu-popup"
      @update:visible="setOpen(option, $event)"
    >
      <SMenuNodeControl
        :option="option"
        :active="active"
        :branch-active="isCurrentBranch"
        :open="isOpen"
        :has-children="hasChildren"
        :popup="true"
        :horizontal-root="isHorizontalRoot"
        :collapsed-root="collapse && level === 0"
        :controls="submenuId"
        @activate="activate"
        @keydown="handleKeydown"
        @mouseenter="openFromHover"
        @mouseleave="closeFromHover"
      />

      <template #content>
        <SMenuPopupPanel
          :option="option"
          :horizontal-root="isHorizontalRoot"
          @mouseenter="openFromHover"
          @mouseleave="closeFromHover"
        >
          <ul :id="submenuId" :class="[ns.e('children'), ns.is('popup-list')]">
            <SMenuNode
              v-for="item in option.children"
              :key="item.key"
              :option="item"
              :level="level + 1"
              :parent="option"
            />
          </ul>
        </SMenuPopupPanel>
      </template>
    </SPopper>

    <template v-else>
      <STooltip
        :disabled="!collapse || level !== 0"
        placement="right"
        :show-after="280"
        :hide-after="80"
        :show-arrow="false"
      >
        <SMenuNodeControl
          :option="option"
          :active="active"
          :branch-active="isCurrentBranch"
          :open="isOpen"
          :has-children="hasChildren"
          :popup="false"
          :horizontal-root="false"
          :collapsed-root="collapse && level === 0"
          :controls="hasChildren ? submenuId : undefined"
          @activate="activate"
          @keydown="handleKeydown"
        />

        <template #content>{{ option.label }}</template>
      </STooltip>

      <Transition name="s-menu-inline">
        <div v-if="hasChildren && isOpen" :class="ns.e('children-motion')">
          <ul :id="submenuId" :class="ns.e('children')">
            <SMenuNode
              v-for="item in option.children"
              :key="item.key"
              :option="item"
              :level="level + 1"
              :parent="option"
            />
          </ul>
        </div>
      </Transition>
    </template>
  </li>
</template>
