<script lang="ts" setup>
import { computed, shallowRef, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { layoutAsideProps, normalizeLayoutSize } from './layout'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SLayoutAside' })

const props = defineProps(layoutAsideProps)
const emit = defineEmits<{
  'update:outsideCollapsed': [value: boolean]
  'outside-collapse': [value: boolean]
}>()
const slots = defineSlots<{
  default?(): unknown
  outside?(props: { collapsed: boolean; toggle: () => void }): unknown
}>()

const ns = useNamespace('layout-aside')
const { t } = useLocale()
const internalOutsideCollapsed = shallowRef(props.outsideCollapsed)

const isOutsideCollapsed = computed(
  () => props.outsideCollapsible && internalOutsideCollapsed.value,
)

const outsideToggleIcon = computed(() => {
  const pointsTowardEnd =
    props.outsidePosition === 'end'
      ? isOutsideCollapsed.value
      : !isOutsideCollapsed.value

  return pointsTowardEnd ? 'cb:chevron-right' : 'cb:chevron-left'
})

const outsideToggleLabel = computed(() =>
  t(
    isOutsideCollapsed.value
      ? 'vs.layout.expandOutside'
      : 'vs.layout.collapseOutside',
  ),
)

watch(
  () => props.outsideCollapsed,
  (value) => {
    internalOutsideCollapsed.value = value
  },
)

watch(
  () => props.outsideCollapsible,
  (value) => {
    if (!value) internalOutsideCollapsed.value = false
  },
)

const toggleOutside = () => {
  if (!props.outsideCollapsible) return

  const value = !isOutsideCollapsed.value
  internalOutsideCollapsed.value = value
  emit('update:outsideCollapsed', value)
  emit('outside-collapse', value)
}

const style = computed<CSSProperties>(() => ({
  width: props.size === undefined ? undefined : normalizeLayoutSize(props.size),
  padding:
    props.padding === undefined
      ? undefined
      : normalizeLayoutSize(props.padding),
}))
</script>

<template>
  <aside
    :class="[
      ns.b(),
      ns.is('with-outside', Boolean(slots.outside)),
      ns.is(`outside-${props.outsidePosition}`, Boolean(slots.outside)),
      ns.is('outside-collapsed', Boolean(slots.outside) && isOutsideCollapsed),
    ]"
    :style="style"
  >
    <div v-if="slots.default" :class="ns.e('content')">
      <slot />
    </div>

    <div
      v-if="slots.outside"
      :class="[
        ns.e('outside'),
        ns.is('collapsible', props.outsideCollapsible),
        ns.is('collapsed', isOutsideCollapsed),
      ]"
    >
      <div :class="ns.e('outside-shell')">
        <div
          :class="ns.e('outside-content')"
          :aria-hidden="isOutsideCollapsed"
          :inert="isOutsideCollapsed"
        >
          <slot
            name="outside"
            :collapsed="isOutsideCollapsed"
            :toggle="toggleOutside"
          />
        </div>
      </div>

      <button
        v-if="props.outsideCollapsible"
        type="button"
        :class="ns.e('outside-toggle')"
        :title="outsideToggleLabel"
        :aria-label="outsideToggleLabel"
        :aria-expanded="!isOutsideCollapsed"
        @click="toggleOutside"
      >
        <SIcon
          :class="ns.e('outside-toggle-icon')"
          :name="outsideToggleIcon"
          size="16"
        />
      </button>
    </div>
  </aside>
</template>
