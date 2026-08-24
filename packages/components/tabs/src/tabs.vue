<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  toRef,
  useId,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { tabsContextKey } from './constants'
import { tabsEmits, tabsProps } from './tabs'
import { calculateTabsOverflowLayout } from './tabs-overflow'
import TabsOverflowTrigger from './tabs-overflow-trigger.vue'

import type { CSSProperties } from 'vue'
import type { TabPaneContext, TabValue } from './constants'
import type { TabsOverflowResult } from './tabs-overflow'

defineOptions({ name: 'STabs' })

const props = defineProps(tabsProps)
const emit = defineEmits(tabsEmits)
const slots = useSlots()
const ns = useNamespace('tabs')
const { t } = useLocale()
const tabsId = useId()
const activeReflowDelay = 180

const panes = shallowRef<TabPaneContext[]>([])
const activeUid = shallowRef<number>()
const lineStyle = shallowRef<CSSProperties>({})
const overflowLayout = shallowRef<TabsOverflowResult>({
  visibleUids: [],
  leadingHiddenUids: [],
  trailingHiddenUids: [],
})
const overflowOpenSide = shallowRef<'leading' | 'trailing'>()
const reflowDirection = shallowRef<'forward' | 'backward'>('forward')

const navWrapRef = useTemplateRef<HTMLElement>('navWrap')
const navViewportRef = useTemplateRef<HTMLElement>('navViewport')
const measureRef = useTemplateRef<HTMLElement>('measure')
const extraRef = useTemplateRef<HTMLElement>('extra')

const isHorizontal = computed(
  () => props.position === 'top' || props.position === 'bottom',
)
const isEditable = computed(() => props.type === 'editable-card')
const showLine = computed(() => props.type === 'line')

const themeColor = computed(() => normalizeVsColor(props.color))
const isThemeColor = computed(() => isVsColor(themeColor.value))
const themeColorClass = computed(() =>
  isThemeColor.value ? ns.m(themeColor.value) : '',
)
const customColor = computed(() => {
  if (isThemeColor.value) return ''
  const color = getVsColor(props.color)
  if (!color) return ''
  return color.startsWith('var(') ? color : `rgb(${color})`
})
const rootStyle = computed((): CSSProperties =>
  customColor.value
    ? ({ '--sax-tabs-color': customColor.value } as CSSProperties)
    : {},
)

const paneValue = (pane: TabPaneContext, index: number): TabValue =>
  pane.name ?? index

const resolveIndex = (value: TabValue) => {
  const namedIndex = panes.value.findIndex((pane) => pane.name === value)
  if (namedIndex >= 0) return namedIndex
  if (typeof value === 'number' && Number.isInteger(value)) return value
  const labelIndex = panes.value.findIndex((pane) => pane.label === value)
  return labelIndex >= 0 ? labelIndex : 0
}

const syncActiveFromModel = () => {
  if (!panes.value.length) {
    activeUid.value = undefined
    return
  }
  const index = Math.min(
    panes.value.length - 1,
    Math.max(0, resolveIndex(props.modelValue)),
  )
  const target = panes.value[index]
  activeUid.value = target.disabled
    ? panes.value.find((pane) => !pane.disabled)?.uid
    : target.uid
}

const updateLine = () => {
  if (!showLine.value) return
  const viewport = navViewportRef.value
  const activeElement = viewport?.querySelector<HTMLElement>(
    `.${ns.e('item')}.${ns.is('active')}`,
  )
  if (!viewport || !activeElement) {
    lineStyle.value = {}
    return
  }

  const viewportRect = viewport.getBoundingClientRect()
  const activeRect = activeElement.getBoundingClientRect()
  lineStyle.value = isHorizontal.value
    ? {
        width: `${activeRect.width}px`,
        transform: `translate3d(${activeRect.left - viewportRect.left}px, 0, 0)`,
      }
    : {
        height: `${activeRect.height}px`,
        transform: `translate3d(0, ${activeRect.top - viewportRect.top}px, 0)`,
      }
}

const measureTabs = async () => {
  await nextTick()
  if (
    !navWrapRef.value ||
    !measureRef.value ||
    !isHorizontal.value ||
    props.overflow !== 'collapse'
  ) {
    overflowLayout.value = {
      visibleUids: panes.value.map((pane) => pane.uid),
      leadingHiddenUids: [],
      trailingHiddenUids: [],
    }
    await nextTick()
    updateLine()
    return
  }

  const itemElements = Array.from(
    measureRef.value.querySelectorAll<HTMLElement>('[data-tabs-measure-item]'),
  )
  const addElement = measureRef.value.querySelector<HTMLElement>(
    '[data-tabs-measure-add]',
  )
  const moreElement = measureRef.value.querySelector<HTMLElement>(
    '[data-tabs-measure-more]',
  )
  const measuredGap = Number.parseFloat(
    getComputedStyle(measureRef.value).columnGap || '0',
  )
  const gap = Number.isFinite(measuredGap) ? measuredGap : 0
  const reservedItems = [
    isEditable.value && !props.hideAdd ? (addElement?.offsetWidth ?? 0) : 0,
    slots.extra ? (extraRef.value?.offsetWidth ?? 0) : 0,
  ].filter((size) => size > 0)
  const reservedSize =
    reservedItems.reduce((total, size) => total + size, 0) +
    reservedItems.length * gap

  overflowLayout.value = calculateTabsOverflowLayout({
    uids: panes.value.map((pane) => pane.uid),
    itemSizes: itemElements.map((element) => element.offsetWidth),
    containerSize: navWrapRef.value.clientWidth,
    reservedSize,
    moreSize: moreElement?.offsetWidth ?? 40,
    gap,
    activeUid: activeUid.value,
  })
  await nextTick()
  updateLine()
}

let layoutTimer: ReturnType<typeof setTimeout> | undefined

const queueLayout = (delay = 0) => {
  if (layoutTimer) {
    clearTimeout(layoutTimer)
    layoutTimer = undefined
  }

  const run = () => {
    layoutTimer = undefined
    nextTick(measureTabs)
  }
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (delay <= 0 || reduceMotion) run()
  else layoutTimer = setTimeout(run, delay)
}

const visiblePanes = computed(() => {
  if (
    props.overflow !== 'collapse' ||
    !isHorizontal.value ||
    !overflowLayout.value.visibleUids.length
  )
    return panes.value
  const visible = new Set(overflowLayout.value.visibleUids)
  return panes.value.filter((pane) => visible.has(pane.uid))
})

const panesByUid = computed(
  () => new Map(panes.value.map((pane) => [pane.uid, pane])),
)

const resolveOverflowPanes = (uids: number[]) =>
  uids
    .map((uid) => panesByUid.value.get(uid))
    .filter((pane): pane is TabPaneContext => pane !== undefined)

const leadingHiddenPanes = computed(() =>
  resolveOverflowPanes(overflowLayout.value.leadingHiddenUids),
)
const trailingHiddenPanes = computed(() =>
  resolveOverflowPanes(overflowLayout.value.trailingHiddenUids),
)

const setOverflowVisible = (side: 'leading' | 'trailing', visible: boolean) => {
  if (visible) overflowOpenSide.value = side
  else if (overflowOpenSide.value === side) overflowOpenSide.value = undefined
}

const updateReflowDirection = (fromUid: number | undefined, toUid: number) => {
  const fromIndex = panes.value.findIndex((pane) => pane.uid === fromUid)
  const toIndex = panes.value.findIndex((pane) => pane.uid === toUid)
  if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex)
    reflowDirection.value = toIndex > fromIndex ? 'forward' : 'backward'
}

const setActiveIndex = (index: number) => {
  const pane = panes.value[index]
  if (!pane || pane.disabled) return
  const changed = activeUid.value !== pane.uid
  const isCurrentlyVisible = overflowLayout.value.visibleUids.includes(pane.uid)
  const hasCollapsedPanes =
    overflowLayout.value.leadingHiddenUids.length > 0 ||
    overflowLayout.value.trailingHiddenUids.length > 0
  if (changed) updateReflowDirection(activeUid.value, pane.uid)
  activeUid.value = pane.uid
  overflowOpenSide.value = undefined
  if (changed) {
    const value = paneValue(pane, index)
    emit('update:modelValue', value)
    emit('change', value, pane)
  }
  queueLayout(
    changed && isCurrentlyVisible && hasCollapsedPanes ? activeReflowDelay : 0,
  )
}

const handleTabClick = (
  pane: TabPaneContext,
  event: MouseEvent | KeyboardEvent,
) => {
  if (pane.disabled) return
  const index = panes.value.findIndex((item) => item.uid === pane.uid)
  const value = paneValue(pane, index)
  emit('tabClick', value, event, pane)
  setActiveIndex(index)
}

const focusPane = async (pane: TabPaneContext) => {
  setActiveIndex(panes.value.findIndex((item) => item.uid === pane.uid))
  await nextTick()
  navViewportRef.value
    ?.querySelector<HTMLElement>(`[data-tab-uid="${pane.uid}"] [role="tab"]`)
    ?.focus()
}

const handleKeydown = (event: KeyboardEvent, pane: TabPaneContext) => {
  const enabledPanes = panes.value.filter((item) => !item.disabled)
  const currentIndex = enabledPanes.findIndex((item) => item.uid === pane.uid)
  if (currentIndex < 0) return

  const forwardKeys = isHorizontal.value ? ['ArrowRight'] : ['ArrowDown']
  const backwardKeys = isHorizontal.value ? ['ArrowLeft'] : ['ArrowUp']
  let target: TabPaneContext | undefined

  if (forwardKeys.includes(event.key))
    target = enabledPanes[(currentIndex + 1) % enabledPanes.length]
  else if (backwardKeys.includes(event.key))
    target =
      enabledPanes[
        (currentIndex - 1 + enabledPanes.length) % enabledPanes.length
      ]
  else if (event.key === 'Home') target = enabledPanes[0]
  else if (event.key === 'End') target = enabledPanes[enabledPanes.length - 1]

  if (target) {
    event.preventDefault()
    focusPane(target)
  }
}

const handleContextMenu = (pane: TabPaneContext, event: MouseEvent) => {
  const index = panes.value.findIndex((item) => item.uid === pane.uid)
  emit('tabContextmenu', paneValue(pane, index), event, pane)
}

const handleAdd = (event: MouseEvent) => {
  emit('add', event)
  emit('edit', event, 'add')
}

const handleRemove = (pane: TabPaneContext, event: MouseEvent) => {
  event.stopPropagation()
  const index = panes.value.findIndex((item) => item.uid === pane.uid)
  const value = paneValue(pane, index)
  emit('remove', value, event)
  emit('edit', value, 'remove')
}

const registerPane = (pane: TabPaneContext) => {
  panes.value = [...panes.value, pane]
  syncActiveFromModel()
  queueLayout()
}

const updatePane = (uid: number, nextPane: Partial<TabPaneContext>) => {
  panes.value = panes.value.map((pane) =>
    pane.uid === uid ? { ...pane, ...nextPane, uid } : pane,
  )
  syncActiveFromModel()
  queueLayout()
}

const unregisterPane = (uid: number) => {
  const removedIndex = panes.value.findIndex((pane) => pane.uid === uid)
  const wasActive = activeUid.value === uid
  panes.value = panes.value.filter((pane) => pane.uid !== uid)
  if (wasActive && panes.value.length) {
    const nextIndex = Math.min(
      Math.max(0, removedIndex),
      panes.value.length - 1,
    )
    const nextPane = panes.value[nextIndex]
    activeUid.value = nextPane.uid
    const value = paneValue(nextPane, nextIndex)
    emit('update:modelValue', value)
    emit('change', value, nextPane)
  } else if (!panes.value.length) activeUid.value = undefined
  queueLayout()
}

const tabId = (uid: number) => `${tabsId}-tab-${uid}`
const panelId = (uid: number) => `${tabsId}-panel-${uid}`

watch(
  () => props.modelValue,
  () => {
    const previousActiveUid = activeUid.value
    syncActiveFromModel()
    if (
      activeUid.value !== previousActiveUid &&
      activeUid.value !== undefined
    ) {
      updateReflowDirection(previousActiveUid, activeUid.value)
      queueLayout()
    }
  },
)
watch(
  () => [
    props.position,
    props.type,
    props.alignment,
    props.overflow,
    props.size,
    props.hideAdd,
  ],
  () => queueLayout(),
)

useResizeObserver(navWrapRef, measureTabs)

provide(tabsContextKey, {
  activeUid,
  animated: toRef(props, 'animated'),
  destroyOnHide: toRef(props, 'destroyOnHide'),
  registerPane,
  updatePane,
  unregisterPane,
  tabId,
  panelId,
})

onMounted(measureTabs)
onBeforeUnmount(() => {
  if (layoutTimer) clearTimeout(layoutTimer)
})
</script>

<template>
  <div
    :class="[
      ns.b(),
      themeColorClass,
      ns.m(`position-${position}`),
      ns.m(`align-${alignment}`),
      ns.m(`type-${type}`),
      ns.m(`overflow-${overflow}`),
      ns.m(`size-${size}`),
      ns.is(`reflow-${reflowDirection}`),
    ]"
    :style="rootStyle"
  >
    <div ref="navWrap" :class="ns.e('nav-wrap')">
      <div ref="navViewport" :class="ns.e('nav-viewport')">
        <div :class="ns.e('nav')">
          <Transition :name="ns.e('overflow')">
            <TabsOverflowTrigger
              v-if="leadingHiddenPanes.length"
              side="leading"
              :position="position === 'bottom' ? 'bottom' : 'top'"
              :panes="leadingHiddenPanes"
              :visible="overflowOpenSide === 'leading'"
              @select="handleTabClick"
              @update:visible="setOverflowVisible('leading', $event)"
            >
              <template #icon>
                <slot name="more-icon">
                  <SIcon name="cb:overflow-menu-horizontal" />
                </slot>
              </template>
            </TabsOverflowTrigger>
          </Transition>

          <TransitionGroup
            tag="ul"
            :name="ns.e('nav-item')"
            :class="ns.e('nav-list')"
            role="tablist"
            :aria-label="ariaLabel || t('vs.tabs.label')"
            :aria-orientation="isHorizontal ? 'horizontal' : 'vertical'"
          >
            <li
              v-for="pane in visiblePanes"
              :key="pane.uid"
              :class="[
                ns.e('item'),
                ns.is('active', pane.uid === activeUid),
                ns.is('disabled', pane.disabled),
                ns.is('closable', isEditable && pane.closable),
              ]"
              :data-tab-uid="pane.uid"
              @contextmenu="handleContextMenu(pane, $event)"
            >
              <button
                :id="tabId(pane.uid)"
                :class="ns.e('btn')"
                type="button"
                role="tab"
                :tabindex="pane.uid === activeUid ? 0 : -1"
                :disabled="pane.disabled"
                :aria-selected="pane.uid === activeUid"
                :aria-controls="panelId(pane.uid)"
                @click="handleTabClick(pane, $event)"
                @keydown="handleKeydown($event, pane)"
              >
                <slot
                  name="label"
                  :pane="pane"
                  :active="pane.uid === activeUid"
                  :value="paneValue(pane, panes.indexOf(pane))"
                >
                  <component :is="pane.renderLabel" v-if="pane.renderLabel" />
                  <template v-else>
                    <SIcon
                      v-if="pane.icon"
                      :class="ns.e('icon')"
                      :name="pane.icon"
                    />
                    <span :class="ns.e('label')">{{ pane.label }}</span>
                    <span
                      v-if="pane.badge !== undefined"
                      :class="ns.e('badge')"
                    >
                      {{ pane.badge }}
                    </span>
                  </template>
                </slot>
              </button>
              <button
                v-if="isEditable && pane.closable"
                :class="ns.e('close')"
                type="button"
                :aria-label="t('vs.tabs.close', { label: pane.label })"
                @click="handleRemove(pane, $event)"
              >
                <slot name="close-icon" :pane="pane">
                  <SIcon name="cb:close" />
                </slot>
              </button>
            </li>
          </TransitionGroup>

          <Transition :name="ns.e('overflow')">
            <TabsOverflowTrigger
              v-if="trailingHiddenPanes.length"
              side="trailing"
              :position="position === 'bottom' ? 'bottom' : 'top'"
              :panes="trailingHiddenPanes"
              :visible="overflowOpenSide === 'trailing'"
              @select="handleTabClick"
              @update:visible="setOverflowVisible('trailing', $event)"
            >
              <template #icon>
                <slot name="more-icon">
                  <SIcon name="cb:overflow-menu-horizontal" />
                </slot>
              </template>
            </TabsOverflowTrigger>
          </Transition>
        </div>

        <span
          v-if="showLine"
          :class="ns.e('indicator')"
          :style="lineStyle"
          aria-hidden="true"
        />
      </div>

      <div
        v-if="(isEditable && !hideAdd) || slots.extra"
        :class="ns.e('actions')"
      >
        <button
          v-if="isEditable && !hideAdd"
          :class="ns.e('action')"
          type="button"
          :aria-label="t('vs.tabs.add')"
          @click="handleAdd"
        >
          <slot name="add-icon"><SIcon name="cb:add" /></slot>
        </button>

        <div v-if="slots.extra" ref="extra" :class="ns.e('extra')">
          <slot name="extra" />
        </div>
      </div>
    </div>

    <div ref="measure" :class="ns.e('measure')" aria-hidden="true">
      <span
        v-for="pane in panes"
        :key="pane.uid"
        data-tabs-measure-item
        :class="ns.e('measure-item')"
      >
        <SIcon v-if="pane.icon" :class="ns.e('icon')" :name="pane.icon" />
        <span>{{ pane.label }}</span>
        <span v-if="pane.badge !== undefined" :class="ns.e('badge')">
          {{ pane.badge }}
        </span>
        <SIcon v-if="isEditable && pane.closable" name="cb:close" />
      </span>
      <span
        data-tabs-measure-more
        :class="[ns.e('measure-action'), ns.e('measure-more')]"
      >
        <SIcon name="cb:overflow-menu-horizontal" />
        <span :class="ns.e('overflow-count')">9</span>
      </span>
      <span data-tabs-measure-add :class="ns.e('measure-action')">
        <SIcon name="cb:add" />
      </span>
    </div>

    <div :class="ns.e('content')">
      <slot />
    </div>
  </div>
</template>
