<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  toRef,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { breadcrumbProps } from './breadcrumb'
import { breadcrumbContextKey } from './constants'
import { planBreadcrumbOverflow } from './breadcrumb-overflow'
import BreadcrumbItemNode from './breadcrumb-item-node.vue'
import BreadcrumbOverflow from './breadcrumb-overflow.vue'
import type { BreadcrumbItem } from './breadcrumb'

defineOptions({ name: 'SBreadcrumb' })

const props = defineProps(breadcrumbProps)
const slots = useSlots()
const ns = useNamespace('breadcrumb')
const { t } = useLocale()

const navRef = useTemplateRef<HTMLElement>('nav')
const listRef = useTemplateRef<HTMLOListElement>('list')
const measureRef = useTemplateRef<HTMLOListElement>('measurement-list')
const availableWidth = shallowRef(0)
const itemWidths = shallowRef<number[]>([])
const overflowWidth = shallowRef(0)

const overflowPlan = computed(() =>
  props.collapse &&
  !slots.default &&
  props.items.length > 2 &&
  itemWidths.value.length === props.items.length
    ? planBreadcrumbOverflow(
        itemWidths.value,
        availableWidth.value,
        overflowWidth.value,
      )
    : {
        collapsed: false,
        prefixCount: props.items.length,
        suffixCount: 0,
      },
)

type VisibleEntry =
  | { kind: 'item'; item: BreadcrumbItem; index: number; key: string }
  | { kind: 'overflow'; hiddenItems: BreadcrumbItem[]; key: string }

const visibleEntries = computed<VisibleEntry[]>(() => {
  const { collapsed, prefixCount, suffixCount } = overflowPlan.value
  const head = props.items.slice(0, prefixCount).map((item, index) => ({
    kind: 'item' as const,
    item,
    index,
    key: `item-${index}`,
  }))
  if (!collapsed) return head

  const suffixStart = props.items.length - suffixCount
  const tail = props.items.slice(suffixStart).map((item, offset) => ({
    kind: 'item' as const,
    item,
    index: suffixStart + offset,
    key: `item-${suffixStart + offset}`,
  }))
  return [
    ...head,
    {
      kind: 'overflow',
      hiddenItems: props.items.slice(prefixCount, suffixStart),
      key: 'overflow',
    },
    ...tail,
  ]
})

const measureLayout = () => {
  const nav = navRef.value
  const list = listRef.value
  const measuringList = measureRef.value
  if (!nav || !list || !measuringList || slots.default) return

  const style = window.getComputedStyle(list)
  const padding =
    (Number.parseFloat(style.paddingLeft) || 0) +
    (Number.parseFloat(style.paddingRight) || 0)
  const width = Math.max(0, nav.clientWidth - padding)
  const widths = Array.from(
    measuringList.querySelectorAll<HTMLElement>('.s-breadcrumb__measure-item'),
    (item) => item.getBoundingClientRect().width,
  )
  const ellipsisWidth =
    measuringList
      .querySelector<HTMLElement>('.s-breadcrumb__overflow-measure')
      ?.getBoundingClientRect().width ?? 0

  if (width !== availableWidth.value) availableWidth.value = width
  if (
    widths.length !== itemWidths.value.length ||
    widths.some((itemWidth, index) => itemWidth !== itemWidths.value[index])
  ) {
    itemWidths.value = widths
  }
  if (ellipsisWidth !== overflowWidth.value) overflowWidth.value = ellipsisWidth
}

let resizeObserver: ResizeObserver | undefined
let disposed = false

onMounted(() => {
  nextTick(measureLayout)
  window.addEventListener('resize', measureLayout)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(measureLayout)
    if (navRef.value) resizeObserver.observe(navRef.value)
    if (measureRef.value) resizeObserver.observe(measureRef.value)
  }
  document.fonts?.ready.then(() => {
    if (!disposed) measureLayout()
  })
})

watch(
  () => [props.items, props.separator, props.collapse],
  () => nextTick(measureLayout),
  { deep: true, flush: 'post' },
)

onBeforeUnmount(() => {
  disposed = true
  resizeObserver?.disconnect()
  window.removeEventListener('resize', measureLayout)
})

provide(breadcrumbContextKey, {
  separator: toRef(props, 'separator'),
  color: toRef(props, 'color'),
})
</script>

<template>
  <nav
    ref="nav"
    :class="[
      ns.b(),
      ns.m(`align-${align}`),
      ns.is('collapsed', overflowPlan.collapsed),
    ]"
    :aria-label="t('vs.breadcrumb.label')"
  >
    <ol ref="list" :class="[ns.e('list'), ns.is('data', !$slots.default)]">
      <slot />
      <template v-if="!$slots.default">
        <template v-for="entry in visibleEntries" :key="entry.key">
          <BreadcrumbOverflow
            v-if="entry.kind === 'overflow'"
            :items="items"
            :hidden-items="entry.hiddenItems"
            :separator="separator"
            :color="color"
            :trigger="trigger"
          />
          <BreadcrumbItemNode
            v-else
            :item="entry.item"
            :is-last="entry.index === items.length - 1"
            :separator="separator"
            :color="color"
            :trigger="trigger"
          />
        </template>
      </template>
    </ol>

    <ol
      v-if="collapse && !$slots.default && items.length > 2"
      ref="measurement-list"
      :class="ns.e('measure')"
      aria-hidden="true"
    >
      <li
        v-for="(item, index) in items"
        :key="`measure-${index}`"
        :class="[ns.e('measure-item'), ns.e('item')]"
      >
        <span :class="ns.e('link')">{{ item.title }}</span>
        <span v-if="item.children?.length" :class="ns.e('measure-toggle')">
          <span :class="ns.e('menu-trigger')" />
        </span>
        <span v-if="index < items.length - 1" :class="ns.e('separator')">
          <SIcon v-if="separator.length > 1" :name="separator" />
          <template v-else>{{ separator }}</template>
        </span>
      </li>
      <li :class="[ns.e('overflow-measure'), ns.e('item')]">
        <span :class="ns.e('overflow-trigger')">…</span>
        <span :class="ns.e('separator')">
          <SIcon v-if="separator.length > 1" :name="separator" />
          <template v-else>{{ separator }}</template>
        </span>
      </li>
    </ol>
  </nav>
</template>
