import { computed, nextTick, shallowReactive, watch } from 'vue'
import { debugWarn } from '@vuesax-alpha/utils'
import { getSplitterNodeSize, resolveSplitterSizes } from './splitter'

import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { SplitterGroupValue, SplitterModelValue } from './splitter'

export interface SplitterRegisteredItem {
  id: symbol
  min: ComputedRef<number | undefined>
  max: ComputedRef<number | undefined>
  disabled: Readonly<Ref<boolean>>
  useRest: ComputedRef<boolean>
}

export interface SplitterRootContext {
  model: ComputedRef<SplitterModelValue>
  disabled: Readonly<Ref<boolean>>
  minSize: ComputedRef<number>
  keyboardStep: ComputedRef<number>
  precision: ComputedRef<number>
  dragging: Ref<boolean>
  updatePair: (
    path: number[],
    index: number,
    first: number,
    second: number,
    restIndex: number,
  ) => void
  normalizeGroup: (path: number[], itemCount: number, restIndex: number) => void
  commit: () => void
}

export interface SplitterGroupContext {
  root: SplitterRootContext
  path: ComputedRef<number[]>
  model: ComputedRef<SplitterGroupValue | undefined>
  items: SplitterRegisteredItem[]
  sizes: ComputedRef<number[]>
  restIndex: ComputedRef<number>
  register: (item: SplitterRegisteredItem) => void
  unregister: (id: symbol) => void
}

export const splitterGroupContextKey: InjectionKey<SplitterGroupContext> =
  Symbol('splitter-group')

export const createSplitterGroupContext = (
  root: SplitterRootContext,
  path: ComputedRef<number[]>,
  model: ComputedRef<SplitterGroupValue | undefined>,
): SplitterGroupContext => {
  const items = shallowReactive<SplitterRegisteredItem[]>([])
  const sizes = computed(() =>
    resolveSplitterSizes(model.value?.size ?? [], items.length),
  )
  const restIndex = computed(() =>
    items.findIndex((item) => item.useRest.value),
  )

  watch(
    () => [
      items.length,
      ...items.map((item) => item.useRest.value),
      ...(model.value?.size.map(getSplitterNodeSize) ?? []),
    ],
    () => {
      nextTick(() => {
        const restCount = items.filter((item) => item.useRest.value).length
        if (restCount > 1) {
          debugWarn(
            'SSplitter',
            'only one SplitterItem per level can use `use-rest`; the first item wins.',
          )
        }
        root.normalizeGroup(path.value, items.length, restIndex.value)
      })
    },
    { flush: 'post' },
  )

  return {
    root,
    path,
    model,
    items,
    sizes,
    restIndex,
    register(item) {
      if (!items.some(({ id }) => id === item.id)) items.push(item)
    },
    unregister(id) {
      const index = items.findIndex((item) => item.id === id)
      if (index >= 0) items.splice(index, 1)
    },
  }
}
