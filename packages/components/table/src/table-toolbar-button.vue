<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { SButton } from '@vuesax-alpha/components/button'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import type { Placement } from '@vuesax-alpha/hooks/use-floating/vue'
import type { ButtonProps } from '@vuesax-alpha/components/button'

export interface TableToolbarButtonItem {
  content: string
  code: string
  icon?: string
  disabled?: boolean
  loading?: boolean
  props?: Partial<ButtonProps>
}

export interface TableToolbarButtonOptions extends Omit<
  Partial<ButtonProps>,
  'icon'
> {
  content?: string
  code?: string
  icon?: string
  children?: TableToolbarButtonItem[]
  trigger?: 'click' | 'hover'
  placement?: Placement
}

defineOptions({ name: 'STableToolbarButton' })

const props = defineProps<{
  options: TableToolbarButtonOptions
  disabled?: boolean
}>()
const emit = defineEmits<{
  action: [code: string, event: MouseEvent]
}>()

const open = shallowRef(false)
const children = computed(() => props.options.children ?? [])
const rendererPropKeys = new Set([
  'content',
  'code',
  'icon',
  'children',
  'trigger',
  'placement',
])
const buttonProps = computed<Partial<ButtonProps>>(() => {
  const result: Record<string, unknown> = {}
  Object.entries(props.options).forEach(([key, value]) => {
    if (!rendererPropKeys.has(key)) result[key] = value
  })
  return result as Partial<ButtonProps>
})
const run = (code: string | undefined, event: MouseEvent) => {
  if (!code || props.disabled) return
  emit('action', code, event)
  open.value = false
}
</script>

<template>
  <SPopper
    v-if="children.length"
    v-model:visible="open"
    :trigger="options.trigger ?? 'click'"
    :placement="options.placement ?? 'bottom-start'"
    :show-arrow="false"
    :offset="6"
    :shift="{ padding: 8, crossAxis: true }"
    popper-class="s-renderer-buttons__popper"
  >
    <SButton
      v-bind="buttonProps"
      :disabled="disabled || buttonProps.disabled"
      :aria-expanded="open"
      aria-haspopup="menu"
    >
      <SIcon v-if="options.icon" :name="options.icon" aria-hidden="true" />
      <span v-if="options.content">{{ options.content }}</span>
    </SButton>
    <template #content>
      <div class="s-renderer-buttons__menu" role="menu">
        <SButton
          v-for="child in children"
          :key="child.code"
          v-bind="child.props"
          :type="child.props?.type ?? 'transparent'"
          :size="child.props?.size ?? buttonProps.size"
          :color="child.props?.color ?? 'dark'"
          :block="child.props?.block ?? true"
          role="menuitem"
          :disabled="disabled || child.disabled || child.props?.disabled"
          :loading="child.loading || child.props?.loading"
          @click="run(child.code, $event)"
        >
          <SIcon v-if="child.icon" :name="child.icon" aria-hidden="true" />
          <span>{{ child.content }}</span>
        </SButton>
      </div>
    </template>
  </SPopper>
  <SButton
    v-else
    v-bind="buttonProps"
    :disabled="disabled || buttonProps.disabled"
    @click="run(options.code, $event)"
  >
    <SIcon v-if="options.icon" :name="options.icon" aria-hidden="true" />
    <span v-if="options.content">{{ options.content }}</span>
  </SButton>
</template>
