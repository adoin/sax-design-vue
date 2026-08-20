<template>
  <div
    :class="[
      ns.b(),
      ns.em('group', direction),
      ns.is('dragging', dragging),
      ns.is('disabled', disabled),
    ]"
    :style="splitterStyle"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref, toRef, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import {
  createSplitterGroupContext,
  splitterGroupContextKey,
} from './splitter-context'
import {
  normalizeSplitterGap,
  normalizeSplitterGroup,
  splitterEmits,
  splitterProps,
  updateSplitterPair,
} from './splitter'

import type { CSSProperties } from 'vue'
import type { SplitterModelValue } from './splitter'

defineOptions({ name: 'SSplitter' })

const props = defineProps(splitterProps)
const emit = defineEmits(splitterEmits)
const ns = useNamespace('splitter')
const internalModel = ref<SplitterModelValue>(props.modelValue)
const dragging = ref(false)

const direction = computed(() => internalModel.value.type)
const splitterStyle = computed<CSSProperties>(() => {
  const { rowGap, columnGap } = normalizeSplitterGap(props.gap)
  return {
    '--s-splitter-row-gap': rowGap,
    '--s-splitter-column-gap': columnGap,
  } as CSSProperties
})
const rootContext = {
  model: computed(() => internalModel.value),
  disabled: toRef(props, 'disabled'),
  minSize: computed(() => Math.max(0, Math.min(props.minSize, 0.49))),
  keyboardStep: computed(() =>
    Math.max(
      10 ** -Math.max(0, Math.min(Math.trunc(props.precision), 8)),
      Math.min(props.keyboardStep ?? 0, 0.25),
    ),
  ),
  precision: computed(() =>
    Math.max(0, Math.min(Math.trunc(props.precision), 8)),
  ),
  dragging,
  updatePair(
    path: number[],
    index: number,
    first: number,
    second: number,
    restIndex: number,
  ) {
    internalModel.value = updateSplitterPair(
      internalModel.value,
      path,
      index,
      first,
      second,
      restIndex,
    )
    emit('update:modelValue', internalModel.value)
  },
  normalizeGroup(path: number[], itemCount: number, restIndex: number) {
    const next = normalizeSplitterGroup(
      internalModel.value,
      path,
      itemCount,
      restIndex,
      Math.max(0, Math.min(Math.trunc(props.precision), 8)),
    )
    if (next === internalModel.value) return
    internalModel.value = next
    emit('update:modelValue', next)
  },
  commit() {
    emit('change', internalModel.value)
  },
}

const groupContext = createSplitterGroupContext(
  rootContext,
  computed(() => []),
  computed(() => internalModel.value),
)

provide(splitterGroupContextKey, groupContext)

watch(
  () => props.modelValue,
  (value) => {
    internalModel.value = value
  },
  { deep: true },
)
</script>
