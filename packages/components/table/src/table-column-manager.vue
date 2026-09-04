<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import { SButton } from '@vuesax-alpha/components/button'
import { SCheckbox } from '@vuesax-alpha/components/checkbox'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SFocusTrap } from '@vuesax-alpha/components/focus-trap'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SSelect } from '@vuesax-alpha/components/select'
import { SVirtualList } from '@vuesax-alpha/components/virtual-list'
import { useId, useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import type { ButtonInstance } from '@vuesax-alpha/components/button'
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
const id = useId()
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
const trigger = shallowRef<ButtonInstance>()
const panel = shallowRef<HTMLElement>()
const list = shallowRef<VirtualListInstance>()
const fixedOptions = computed(() => [
  { label: t('vs.table.unfixedColumn'), value: 'none' },
  { label: t('vs.table.fixedLeftColumn'), value: 'left' },
  { label: t('vs.table.fixedRightColumn'), value: 'right' },
])
const itemKeyAt = (position: number) =>
  props.manager.keyAt(props.manager.layout.value.sourceAt(position))
let restoreTriggerFocus = false
const close = () => {
  restoreTriggerFocus = true
  open.value = false
}
const toggleFromKeyboard = () => {
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
    trigger.value?.$el.focus()
  restoreTriggerFocus = false
}
const focusPanel = () => panel.value?.focus()
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
  const index = row?.dataset.columnKey
    ? props.manager.indexForKey(row.dataset.columnKey)
    : 0
  const position = props.manager.layout.value.positionOf(index)
  const next = Math.max(
    0,
    Math.min(props.manager.count.value - 1, position + direction * 5),
  )
  list.value?.scrollToIndex(next, 'start')
  await nextTick()
  const key = itemKeyAt(next)
  const target = Array.from(
    panel.value?.querySelectorAll<HTMLElement>('[data-column-key]') ?? [],
  ).find((element) => element.dataset.columnKey === key)
  target?.querySelector<HTMLElement>('input')?.focus()
}
const move = async (item: ManagedColumn, direction: -1 | 1) => {
  const action = direction === -1 ? 'up' : 'down'
  props.manager.move(item.key, direction)
  await nextTick()
  const position = props.manager.layout.value.positionOf(item.index)
  list.value?.scrollToIndex(position, 'auto')
  await nextTick()
  const row = Array.from(
    panel.value?.querySelectorAll<HTMLElement>('[data-column-key]') ?? [],
  ).find((element) => element.dataset.columnKey === item.key)
  const button = row?.querySelector<HTMLButtonElement>(
    `button[data-action="${action}"]:not(:disabled)`,
  )
  ;(button ?? row?.querySelector<HTMLElement>('input') ?? panel.value)?.focus()
}
watch(
  () => props.disabled,
  (value) => {
    if (value) open.value = false
  },
)
</script>

<template>
  <div :class="ns.e('column-manager')">
    <SPopper
      v-model:visible="open"
      trigger="click"
      placement="bottom-end"
      :disabled="disabled"
      :show-arrow="false"
      :offset="8"
      :hide-after="0"
      :shift="{ padding: 8, crossAxis: true }"
      :process-before-close="canClose"
      :popper-class="[
        ns.e('column-panel'),
        ns.is('square', shape === 'square'),
      ]"
      @show="focusPanel"
      @hide="afterHide"
    >
      <SButton
        ref="trigger"
        type="flat"
        size="small"
        :disabled="disabled"
        :aria-expanded="open"
        aria-haspopup="dialog"
        @keydown.enter.stop.prevent="toggleFromKeyboard"
        @keydown.space.stop.prevent="toggleFromKeyboard"
      >
        <SIcon name="cb:settings" aria-hidden="true" />
        {{ t('vs.table.columnSettings') }}
      </SButton>
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
            @keydown.esc.stop.prevent="close"
            @keydown.page-up.stop.prevent="page($event, -1)"
            @keydown.page-down.stop.prevent="page($event, 1)"
          >
            <div :class="ns.e('column-panel-title')">
              {{ t('vs.table.columnSettings') }}
            </div>
            <SVirtualList
              ref="list"
              :count="manager.count.value"
              :item-at="manager.itemAt"
              :item-key-at="itemKeyAt"
              :height="Math.min(280, manager.count.value * 56)"
              :estimate-size="56"
              :dynamic="false"
              :overscan="2"
            >
              <template #default="{ item }">
                <div
                  :class="ns.e('column-setting')"
                  :data-column-key="(item as ManagedColumn).key"
                >
                  <SCheckbox
                    :model-value="!(item as ManagedColumn).hidden"
                    :disabled="disabled"
                    :label="(item as ManagedColumn).title"
                    :title="(item as ManagedColumn).title"
                    @update:model-value="
                      manager.update((item as ManagedColumn).key, {
                        hidden: !$event,
                      })
                    "
                  />
                  <label
                    :class="ns.e('column-setting-label')"
                    :for="`${id}-${(item as ManagedColumn).index}`"
                    >{{
                      t('vs.table.pinColumn', {
                        column: (item as ManagedColumn).title,
                      })
                    }}</label
                  >
                  <SSelect
                    :id="`${id}-${(item as ManagedColumn).index}`"
                    :model-value="(item as ManagedColumn).fixed || 'none'"
                    :options="fixedOptions"
                    :disabled="disabled"
                    @visible-change="nestedVisibility"
                    @update:model-value="
                      manager.update((item as ManagedColumn).key, {
                        fixed:
                          $event === 'left' || $event === 'right'
                            ? $event
                            : false,
                      })
                    "
                  />
                  <SButton
                    v-for="direction in [-1, 1] as const"
                    :key="direction"
                    icon
                    :debounce="false"
                    type="flat"
                    size="small"
                    :data-action="direction === -1 ? 'up' : 'down'"
                    :disabled="
                      disabled ||
                      (item as ManagedColumn).position + direction < 0 ||
                      (item as ManagedColumn).position + direction >=
                        manager.count.value
                    "
                    :aria-label="
                      t(
                        direction === -1
                          ? 'vs.table.moveColumnUp'
                          : 'vs.table.moveColumnDown',
                        { column: (item as ManagedColumn).title },
                      )
                    "
                    @click="move(item as ManagedColumn, direction)"
                  >
                    <SIcon
                      :name="
                        direction === -1 ? 'cb:chevron-up' : 'cb:chevron-down'
                      "
                      aria-hidden="true"
                    />
                  </SButton>
                </div>
              </template>
            </SVirtualList>
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
