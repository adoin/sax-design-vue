<script setup lang="ts">
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'

defineProps<{
  visible: boolean
  label: string
}>()

const emit = defineEmits<{
  jump: []
  hold: []
  release: []
}>()

const ns = useNamespace('table')
const { t } = useLocale()
</script>

<template>
  <Transition :name="ns.b('parent-indicator')">
    <button
      v-if="visible"
      type="button"
      :class="ns.e('parent-indicator')"
      :aria-label="t('vs.table.returnToParentLabel', { parent: label })"
      @click="emit('jump')"
      @pointerenter="emit('hold')"
      @pointerleave="emit('release')"
      @focus="emit('hold')"
      @blur="emit('release')"
    >
      <span :class="ns.e('parent-indicator-mark')" aria-hidden="true">
        <SIcon name="cb:arrow-up-left" />
      </span>
      <span :class="ns.e('parent-indicator-context')">
        <span>{{ t('vs.table.parentContext') }}</span>
        <strong>{{ label }}</strong>
      </span>
      <span :class="ns.e('parent-indicator-action')">
        {{ t('vs.table.returnToParent') }}
        <SIcon name="cb:chevron-right" aria-hidden="true" />
      </span>
    </button>
  </Transition>
</template>
