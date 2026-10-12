<script setup lang="ts">
import { SButton } from '@vuesax-alpha/components/button'
import { SIcon } from '@vuesax-alpha/components/icon'
import { STooltip } from '@vuesax-alpha/components/tooltip'
withDefaults(
  defineProps<{
    label: string
    icon: string
    disabled?: boolean
    active?: boolean
  }>(),
  { active: undefined },
)
const emit = defineEmits<{ click: [] }>()
</script>
<template>
  <STooltip
    :trigger="['hover', 'focus']"
    placement="top"
    :show-arrow="false"
    shape="default"
  >
    <SButton
      icon
      size="small"
      type="flat"
      shape="rounded"
      :aria-label="label"
      :active="active"
      :aria-pressed="active"
      :disabled="disabled"
      @click="emit('click')"
    >
      <SIcon :name="icon" />
    </SButton>
    <template #content>{{ label }}</template>
  </STooltip>
</template>
