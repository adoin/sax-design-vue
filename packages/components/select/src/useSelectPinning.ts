import { computed, onMounted, shallowRef, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { isEqual } from 'lodash-unified'
import type { SelectOptionValue } from './tokens'

export interface SelectPinningSource {
  pinKey?: string
  getPinOptions?: () => SelectOptionValue[] | Promise<SelectOptionValue[]>
  pinMethod?: (value: SelectOptionValue) => void | Promise<void>
  unpinMethod?: (value: SelectOptionValue) => void | Promise<void>
}

export interface SelectPinningCallbacks {
  onFetch?: (values: SelectOptionValue[], loaded: boolean) => void
  onChange?: (payload: {
    value: SelectOptionValue
    pinned: boolean
    values: SelectOptionValue[]
  }) => void
}

export const getPinnedValueIndex = (
  pinnedValues: readonly SelectOptionValue[],
  value: SelectOptionValue,
) => pinnedValues.findIndex((pinnedValue) => isEqual(pinnedValue, value))

export const sortOptionsByPinnedValues = <T>(
  options: readonly T[],
  pinnedValues: readonly SelectOptionValue[],
  getValue: (option: T) => SelectOptionValue,
) => {
  if (!pinnedValues.length) return [...options]

  const pinned: Array<{ option: T; pinIndex: number; sourceIndex: number }> = []
  const unpinned: T[] = []

  options.forEach((option, sourceIndex) => {
    const pinIndex = getPinnedValueIndex(pinnedValues, getValue(option))
    if (pinIndex < 0) unpinned.push(option)
    else pinned.push({ option, pinIndex, sourceIndex })
  })

  pinned.sort(
    (left, right) =>
      left.pinIndex - right.pinIndex || left.sourceIndex - right.sourceIndex,
  )

  return [...pinned.map(({ option }) => option), ...unpinned]
}

export const useSelectPinning = (
  source: SelectPinningSource,
  callbacks: SelectPinningCallbacks = {},
) => {
  const storageKey = computed(
    () => `s-select-pinned-${source.pinKey || 'disabled'}`,
  )
  const localPinnedItems = useLocalStorage<SelectOptionValue[]>(storageKey, [])
  const remotePinnedItems = shallowRef<SelectOptionValue[]>([])
  const pinItemsLoaded = shallowRef(!source.getPinOptions)
  const pinLoadingValue = shallowRef<SelectOptionValue>()

  const usesRemoteStorage = computed(() => Boolean(source.getPinOptions))
  const isPinEnabled = computed(
    () =>
      Boolean(source.pinKey && !source.getPinOptions) ||
      Boolean(source.getPinOptions && source.pinMethod && source.unpinMethod),
  )
  const pinnedItems = computed(() =>
    usesRemoteStorage.value ? remotePinnedItems.value : localPinnedItems.value,
  )

  const isPinned = (value: SelectOptionValue) =>
    getPinnedValueIndex(pinnedItems.value, value) >= 0

  const isPinLoading = (value: SelectOptionValue) =>
    pinLoadingValue.value !== undefined && isEqual(pinLoadingValue.value, value)

  const emitFetchedItems = () =>
    callbacks.onFetch?.([...pinnedItems.value], pinItemsLoaded.value)

  const refreshPinnedItems = async () => {
    if (!source.getPinOptions) {
      pinItemsLoaded.value = true
      emitFetchedItems()
      return [...pinnedItems.value]
    }

    pinItemsLoaded.value = false
    emitFetchedItems()
    try {
      remotePinnedItems.value = [...(await source.getPinOptions())]
      return [...remotePinnedItems.value]
    } finally {
      pinItemsLoaded.value = true
      emitFetchedItems()
    }
  }

  const togglePin = async (value: SelectOptionValue) => {
    if (!isPinEnabled.value || pinLoadingValue.value !== undefined) return

    const wasPinned = isPinned(value)
    pinLoadingValue.value = value
    try {
      if (!usesRemoteStorage.value) {
        localPinnedItems.value = wasPinned
          ? localPinnedItems.value.filter(
              (pinnedValue) => !isEqual(pinnedValue, value),
            )
          : [...localPinnedItems.value, value]
      } else {
        if (wasPinned) await source.unpinMethod?.(value)
        else await source.pinMethod?.(value)
        await refreshPinnedItems()
      }

      callbacks.onChange?.({
        value,
        pinned: !wasPinned,
        values: [...pinnedItems.value],
      })
    } finally {
      pinLoadingValue.value = undefined
    }
  }

  onMounted(refreshPinnedItems)
  watch(
    () => source.getPinOptions,
    (current, previous) => {
      if (current !== previous) refreshPinnedItems()
    },
  )

  return {
    isPinEnabled,
    pinnedItems,
    pinItemsLoaded,
    pinLoadingValue,
    isPinned,
    isPinLoading,
    refreshPinnedItems,
    togglePin,
  }
}
