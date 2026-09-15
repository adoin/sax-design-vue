<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import { SButton } from '@vuesax-alpha/components/button'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SFocusTrap } from '@vuesax-alpha/components/focus-trap'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SVirtualList } from '@vuesax-alpha/components/virtual-list'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import TableColumnSetting from './table-column-setting.vue'
import TableColumnSettingBranch from './table-column-setting-branch.vue'
import type { VirtualListInstance } from '@vuesax-alpha/components/virtual-list'
import type {
  ManagedColumn,
  useTableColumnManager,
} from './composables/use-table-column-manager'

const props = defineProps<{
  manager: ReturnType<typeof useTableColumnManager>
  disabled: boolean
}>()
const ns = useNamespace('table')
const shape = useShape()
const { t } = useLocale()
const open = shallowRef(false)
let nestedOpen = false
let nestedCloseTimer: ReturnType<typeof setTimeout> | undefined
const nestedVisibility = (visible: boolean) => {
  clearTimeout(nestedCloseTimer)
  if (visible) nestedOpen = true
  // Keep the child active through its closing click so the parent's outside-close is ignored.
  else
    nestedCloseTimer = setTimeout(() => {
      nestedOpen = false
    }, 0)
}
onBeforeUnmount(() => clearTimeout(nestedCloseTimer))
const canClose = () => !nestedOpen
const trigger = shallowRef<HTMLButtonElement>()
const panel = shallowRef<HTMLElement>()
const list = shallowRef<VirtualListInstance>()
const fixedOptions = computed(() => [
  { label: t('vs.table.unfixedColumn'), value: 'none' },
  { label: t('vs.table.fixedLeftColumn'), value: 'left' },
  { label: t('vs.table.fixedRightColumn'), value: 'right' },
])
const virtualizeSettings = computed(() => props.manager.settingCount.value > 20)
const materializedColumns = computed(() =>
  Array.from({ length: props.manager.settingCount.value }, (_, position) =>
    props.manager.settingItemAt(position),
  ),
)
interface ColumnSettingTree {
  item: ManagedColumn
  children: ColumnSettingTree[]
}
const materializedBranches = computed(() => {
  const branches = materializedColumns.value.map<ColumnSettingTree>((item) => ({
    item,
    children: [],
  }))
  const byKey = new Map(branches.map((branch) => [branch.item.key, branch]))
  const roots: ColumnSettingTree[] = []
  branches.forEach((branch) => {
    const parent = branch.item.parentKey
      ? byKey.get(branch.item.parentKey)
      : undefined
    if (parent?.item.group) parent.children.push(branch)
    else roots.push(branch)
  })
  return roots
})
const branchRootIndexByPosition = computed(() => {
  const result = new Map<number, number>()
  const visit = (branch: ColumnSettingTree, rootIndex: number) => {
    result.set(branch.item.position, rootIndex)
    branch.children.forEach((child) => visit(child, rootIndex))
  }
  materializedBranches.value.forEach(visit)
  return result
})
const virtualIndexForPosition = (position: number) =>
  props.manager.hasGroups.value
    ? (branchRootIndexByPosition.value.get(position) ?? 0)
    : position
const branchAt = (index: number) => materializedBranches.value[index]
const branchKeyAt = (index: number) =>
  materializedBranches.value[index]?.item.key ?? String(index)
const virtualContentReady = shallowRef(false)
const panelContentReady = computed(
  () => !virtualizeSettings.value || virtualContentReady.value,
)
const markVirtualContentReady = () => {
  if (virtualContentReady.value) return
  nextTick(() =>
    requestAnimationFrame(() => {
      virtualContentReady.value = true
    }),
  )
}
const itemKeyAt = (position: number) =>
  props.manager.settingItemAt(position).key
let restoreTriggerFocus = false
const close = () => {
  restoreTriggerFocus = true
  open.value = false
}
const togglePanel = () => {
  if (props.disabled) return
  if (open.value) close()
  else {
    restoreTriggerFocus = false
    open.value = true
  }
}
const afterHide = () => {
  // The popper may retain its trapped content until the leave transition ends.
  if (restoreTriggerFocus && !open.value && !props.disabled)
    trigger.value?.focus()
  restoreTriggerFocus = false
}
const focusPanel = () => {
  if (panelContentReady.value) panel.value?.focus({ preventScroll: true })
}
const allowOutsidePointerFocus = (event: CustomEvent) => {
  // Let the shared popper close on outside clicks without pulling focus back.
  if (
    event.detail?.focusReason === 'pointer' &&
    !panel.value?.contains(panel.value.ownerDocument.activeElement)
  )
    event.preventDefault()
}
const page = async (event: KeyboardEvent, direction: -1 | 1) => {
  const row = (event.target as HTMLElement).closest<HTMLElement>(
    '[data-column-key]',
  )
  const position = row?.dataset.columnKey
    ? props.manager.settingIndexForKey(row.dataset.columnKey)
    : 0
  const next = Math.max(
    0,
    Math.min(props.manager.settingCount.value - 1, position + direction * 5),
  )
  if (virtualizeSettings.value)
    list.value?.scrollToIndex(virtualIndexForPosition(next), 'start')
  await nextTick()
  const key = itemKeyAt(next)
  const target = Array.from(
    panel.value?.querySelectorAll<HTMLElement>('[data-column-key]') ?? [],
  ).find((element) => element.dataset.columnKey === key)
  if (!virtualizeSettings.value)
    target?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  target?.querySelector<HTMLElement>('input')?.focus()
}
type ColumnDropPlacement = 'before' | 'inside' | 'after'
interface ColumnDragSession {
  key: string
  from: number
  target?: number
  placement: ColumnDropPlacement
  keyboard: boolean
}
const dragSession = shallowRef<ColumnDragSession>()
const dragAnnouncement = shallowRef<'grabbed' | 'moved' | 'cancelled' | ''>('')
let dragCleanup: (() => void) | undefined
const clearDrag = () => {
  dragCleanup?.()
  dragCleanup = undefined
  dragSession.value = undefined
}
const focusDragHandle = async (key: string) => {
  await nextTick()
  const position = props.manager.settingIndexForKey(key)
  if (virtualizeSettings.value)
    list.value?.scrollToIndex(virtualIndexForPosition(position), 'auto')
  await nextTick()
  const row = Array.from(
    panel.value?.querySelectorAll<HTMLElement>('[data-column-key]') ?? [],
  ).find((element) => element.dataset.columnKey === key)
  if (!virtualizeSettings.value)
    row?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  ;(
    row?.querySelector<HTMLButtonElement>(
      `.${ns.e('column-drag-handle')}:not(:disabled)`,
    ) ?? panel.value
  )?.focus()
}
const cancelDrag = () => {
  const current = dragSession.value
  clearDrag()
  if (!current) return
  dragAnnouncement.value = 'cancelled'
  focusDragHandle(current.key)
}
const dropColumn = () => {
  const current = dragSession.value
  clearDrag()
  if (!current) return
  const moved =
    current.target !== undefined &&
    props.manager.moveSetting(current.key, current.target, current.placement)
  dragAnnouncement.value = moved ? 'moved' : 'cancelled'
  focusDragHandle(current.key)
}
const beginDrag = (item: ManagedColumn, keyboard: boolean) => {
  if (props.disabled) return false
  clearDrag()
  dragSession.value = {
    key: item.key,
    from: item.position,
    placement: 'before',
    keyboard,
  }
  dragAnnouncement.value = 'grabbed'
  if (keyboard) panel.value?.focus({ preventScroll: true })
  return true
}
const chooseDropTarget = (target: number, placement: ColumnDropPlacement) => {
  const current = dragSession.value
  if (!current || target < 0 || target >= props.manager.settingCount.value)
    return
  dragSession.value = {
    ...current,
    target: target === current.from ? undefined : target,
    placement,
  }
}
const startPointerDrag = (event: PointerEvent, item: ManagedColumn) => {
  if (
    event.button !== 0 ||
    event.isPrimary === false ||
    !beginDrag(item, false) ||
    !panel.value
  )
    return
  event.preventDefault()
  event.stopPropagation()
  const root = panel.value
  const doc = root.ownerDocument
  const win = doc.defaultView!
  const scroller = root.querySelector<HTMLElement>(
    `.${ns.e('column-settings-list')}, .s-vl__window`,
  )
  const pointerId = event.pointerId
  const startX = event.clientX
  const startY = event.clientY
  let x = startX
  let y = startY
  let moved = false
  let frame = 0
  const hit = () => {
    const current = dragSession.value
    if (!current || !moved) return
    const element = doc
      .elementFromPoint(x, y)
      ?.closest<HTMLElement>('[data-column-position]')
    if (!element || !root.contains(element)) {
      dragSession.value = { ...current, target: undefined }
      return
    }
    const target = Number(element.dataset.columnPosition)
    const box = element.getBoundingClientRect()
    const ratio = (y - box.top) / Math.max(1, box.height)
    const targetItem = props.manager.settingItemAt(target)
    chooseDropTarget(
      target,
      targetItem.group && ratio >= 0.25 && ratio <= 0.75
        ? 'inside'
        : ratio < 0.5
          ? 'before'
          : 'after',
    )
  }
  const tick = () => {
    if (!dragSession.value) return
    if (moved && scroller) {
      const box = scroller.getBoundingClientRect()
      const threshold = Math.min(36, box.height / 3)
      const delta =
        y < box.top + threshold
          ? -12 * Math.min(1, (box.top + threshold - y) / threshold)
          : y > box.bottom - threshold
            ? 12 * Math.min(1, (y - box.bottom + threshold) / threshold)
            : 0
      if (delta) scroller.scrollTop += delta
    }
    hit()
    frame = win.requestAnimationFrame(tick)
  }
  const movePointer = (moveEvent: PointerEvent) => {
    if (moveEvent.pointerId !== pointerId) return
    x = moveEvent.clientX
    y = moveEvent.clientY
    moved ||= Math.hypot(x - startX, y - startY) >= 3
  }
  const endPointer = (upEvent: PointerEvent) => {
    if (upEvent.pointerId !== pointerId) return
    movePointer(upEvent)
    hit()
    dropColumn()
  }
  const cancelPointer = (cancelEvent: PointerEvent) => {
    if (cancelEvent.pointerId === pointerId) cancelDrag()
  }
  const cancelFromKeyboard = (keyEvent: KeyboardEvent) => {
    if (keyEvent.key === 'Escape') {
      keyEvent.preventDefault()
      cancelDrag()
    }
  }
  const cancelFromWindow = () => cancelDrag()
  doc.addEventListener('pointermove', movePointer)
  doc.addEventListener('pointerup', endPointer)
  doc.addEventListener('pointercancel', cancelPointer)
  doc.addEventListener('keydown', cancelFromKeyboard)
  win.addEventListener('blur', cancelFromWindow)
  root.setPointerCapture?.(pointerId)
  frame = win.requestAnimationFrame(tick)
  dragCleanup = () => {
    win.cancelAnimationFrame(frame)
    doc.removeEventListener('pointermove', movePointer)
    doc.removeEventListener('pointerup', endPointer)
    doc.removeEventListener('pointercancel', cancelPointer)
    doc.removeEventListener('keydown', cancelFromKeyboard)
    win.removeEventListener('blur', cancelFromWindow)
    if (root.hasPointerCapture?.(pointerId))
      root.releasePointerCapture(pointerId)
  }
}
const handleDragKeydown = (event: KeyboardEvent, item?: ManagedColumn) => {
  if (event.isComposing || event.defaultPrevented) return
  if (event.key === ' ' || event.key === 'Enter') {
    if (!dragSession.value && !item) return
    event.preventDefault()
    event.stopPropagation()
    if (dragSession.value?.keyboard) dropColumn()
    else if (item) beginDrag(item, true)
    return
  }
  const current = dragSession.value
  if (
    !current?.keyboard ||
    !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
  )
    return
  event.preventDefault()
  event.stopPropagation()
  if (event.key === 'ArrowRight') {
    if (current.target === undefined) return
    const targetItem = props.manager.settingItemAt(current.target)
    if (targetItem.group) chooseDropTarget(current.target, 'inside')
    return
  }
  if (event.key === 'ArrowLeft') {
    const source = props.manager.settingItemAt(current.from)
    if (!source.parentKey) return
    const parentPosition = props.manager.settingIndexForKey(source.parentKey)
    if (parentPosition >= 0) chooseDropTarget(parentPosition, 'after')
    return
  }
  const direction = event.key === 'ArrowUp' ? -1 : 1
  const target = (current.target ?? current.from) + direction
  if (target < 0 || target >= props.manager.settingCount.value) return
  chooseDropTarget(target, direction < 0 ? 'before' : 'after')
  if (virtualizeSettings.value)
    list.value?.scrollToIndex(virtualIndexForPosition(target), 'auto')
  else
    nextTick(() =>
      panel.value
        ?.querySelector<HTMLElement>(`[data-column-position="${target}"]`)
        ?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }),
    )
}
const closeOrCancelDrag = () => {
  if (dragSession.value) cancelDrag()
  else close()
}
onBeforeUnmount(clearDrag)
watch(
  () => props.disabled,
  (value) => {
    if (value) {
      clearDrag()
      open.value = false
    }
  },
)
watch(panelContentReady, (ready) => {
  if (ready && open.value) focusPanel()
})
</script>

<template>
  <div :class="ns.e('column-manager')">
    <SPopper
      v-model:visible="open"
      :trigger="[]"
      placement="bottom-end"
      animation="none"
      :disabled="disabled"
      :show-arrow="false"
      :offset="8"
      :hide-after="0"
      persistent
      :shift="{ padding: 8, crossAxis: true }"
      :process-before-close="canClose"
      :popper-class="[
        ns.e('column-panel'),
        ns.is('square', shape === 'square'),
        ns.is('content-pending', !panelContentReady),
      ]"
      @show="focusPanel"
      @hide="afterHide"
    >
      <button
        ref="trigger"
        type="button"
        :class="ns.e('column-manager-trigger')"
        :disabled="disabled"
        :aria-expanded="open"
        aria-haspopup="dialog"
        @click="togglePanel"
      >
        <SIcon name="cb:settings" aria-hidden="true" />
        {{ t('vs.table.columnSettings') }}
      </button>
      <template #content>
        <SFocusTrap
          :trapped="open"
          :loop="true"
          :focus-trap-el="panel"
          @focus-after-released.prevent
          @focusout-prevented="allowOutsidePointerFocus"
        >
          <div
            ref="panel"
            tabindex="-1"
            role="dialog"
            :aria-label="t('vs.table.columnSettings')"
            @keydown="handleDragKeydown($event)"
            @keydown.esc.stop.prevent="closeOrCancelDrag"
            @keydown.page-up.stop.prevent="page($event, -1)"
            @keydown.page-down.stop.prevent="page($event, 1)"
          >
            <div :class="ns.e('column-panel-title')">
              {{ t('vs.table.columnSettings') }}
            </div>
            <div
              v-if="!virtualizeSettings"
              :class="ns.e('column-settings-list')"
            >
              <template v-if="manager.hasGroups.value">
                <TableColumnSettingBranch
                  v-for="branch in materializedBranches"
                  :key="branch.item.key"
                  :branch="branch"
                  :manager="manager"
                  :fixed-options="fixedOptions"
                  :disabled="disabled"
                  :drag-key="dragSession?.key"
                  :drop-target="dragSession?.target"
                  :drop-placement="dragSession?.placement ?? 'before'"
                  @nested-visibility="nestedVisibility"
                  @pointerdown="startPointerDrag"
                  @keydown="handleDragKeydown"
                />
              </template>
              <template v-else>
                <TableColumnSetting
                  v-for="item in materializedColumns"
                  :key="item.key"
                  :item="item"
                  :manager="manager"
                  :fixed-options="fixedOptions"
                  :disabled="disabled"
                  :drag-key="dragSession?.key"
                  :drop-target="dragSession?.target"
                  :drop-placement="dragSession?.placement ?? 'before'"
                  @nested-visibility="nestedVisibility"
                  @pointerdown="startPointerDrag"
                  @keydown="handleDragKeydown"
                />
              </template>
            </div>
            <SVirtualList
              v-else-if="manager.hasGroups.value"
              ref="list"
              :count="materializedBranches.length"
              :item-at="branchAt"
              :item-key-at="branchKeyAt"
              :height="Math.min(280, manager.settingCount.value * 56)"
              :estimate-size="168"
              dynamic
              :overscan="1"
              @range-change="markVirtualContentReady"
            >
              <template #default="{ item }">
                <TableColumnSettingBranch
                  :branch="item as ColumnSettingTree"
                  :manager="manager"
                  :fixed-options="fixedOptions"
                  :disabled="disabled"
                  :drag-key="dragSession?.key"
                  :drop-target="dragSession?.target"
                  :drop-placement="dragSession?.placement ?? 'before'"
                  @nested-visibility="nestedVisibility"
                  @pointerdown="startPointerDrag"
                  @keydown="handleDragKeydown"
                />
              </template>
            </SVirtualList>
            <SVirtualList
              v-else
              ref="list"
              :count="manager.settingCount.value"
              :item-at="manager.settingItemAt"
              :item-key-at="itemKeyAt"
              :height="Math.min(280, manager.settingCount.value * 56)"
              :estimate-size="56"
              :dynamic="false"
              :overscan="2"
              @range-change="markVirtualContentReady"
            >
              <template #default="{ item }">
                <TableColumnSetting
                  :item="item as ManagedColumn"
                  :manager="manager"
                  :fixed-options="fixedOptions"
                  :disabled="disabled"
                  :drag-key="dragSession?.key"
                  :drop-target="dragSession?.target"
                  :drop-placement="dragSession?.placement ?? 'before'"
                  @nested-visibility="nestedVisibility"
                  @pointerdown="startPointerDrag"
                  @keydown="handleDragKeydown"
                />
              </template>
            </SVirtualList>
            <span
              :class="ns.e('column-drag-status')"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              >{{
                dragSession?.target !== undefined
                  ? dragSession.placement === 'inside'
                    ? t('vs.table.dragColumnInside', {
                        column: manager.settingItemAt(dragSession.target).title,
                      })
                    : t('vs.table.dragColumnTarget', {
                        position: dragSession.target + 1,
                      })
                  : dragAnnouncement
                    ? t(`vs.table.columnDragStatus.${dragAnnouncement}`)
                    : ''
              }}</span
            >
            <div :class="ns.e('column-panel-actions')">
              <SButton
                type="flat"
                size="small"
                :disabled="disabled || !manager.state.value.length"
                @click="manager.reset()"
                >{{ t('vs.table.resetColumns') }}</SButton
              >
              <SButton size="small" @click="close">{{
                t('vs.common.close')
              }}</SButton>
            </div>
          </div>
        </SFocusTrap>
      </template>
    </SPopper>
  </div>
</template>
