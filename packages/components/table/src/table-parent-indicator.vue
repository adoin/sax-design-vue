<script setup lang="ts">
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import type { TableParentIndicatorSlotParams, TableRowKey } from './table'

const props = defineProps<{
  visible: boolean
  parentKey: TableRowKey
  label: string
}>()

const emit = defineEmits<{
  jump: []
  hold: []
  release: []
}>()

const ns = useNamespace('table')
const { t } = useLocale()
const slots = defineSlots<{
  default?(params: TableParentIndicatorSlotParams): unknown
}>()
const jump = () => emit('jump')
</script>

<template>
  <Transition :name="ns.b('parent-indicator')">
    <component
      :is="slots.default ? 'div' : 'button'"
      v-if="visible"
      :type="slots.default ? undefined : 'button'"
      :class="[
        ns.e('parent-indicator'),
        ns.is('custom', Boolean(slots.default)),
      ]"
      :aria-label="
        slots.default
          ? undefined
          : t('vs.table.returnToParentLabel', { parent: label })
      "
      @click="slots.default ? undefined : jump()"
      @pointerenter="emit('hold')"
      @pointerleave="emit('release')"
      @focusin="emit('hold')"
      @focusout="emit('release')"
    >
      <span :class="ns.e('parent-indicator-mark')" aria-hidden="true">
        <SIcon name="cb:arrow-up-left" />
      </span>
      <div v-if="slots.default" :class="ns.e('parent-indicator-custom')">
        <slot :parent-key="props.parentKey" :label="props.label" :jump="jump" />
      </div>
      <template v-else>
        <span :class="ns.e('parent-indicator-context')">
          <span>{{ t('vs.table.parentContext') }}</span>
          <strong>{{ label }}</strong>
        </span>
        <span :class="ns.e('parent-indicator-action')">
          {{ t('vs.table.returnToParent') }}
          <SIcon name="cb:chevron-right" aria-hidden="true" />
        </span>
      </template>
    </component>
  </Transition>
</template>
