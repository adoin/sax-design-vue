<script lang="ts" setup>
import { computed } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'

import type { MenuOption } from './menu'

defineOptions({ name: 'SMenuNodeControl' })

const props = defineProps<{
  option: MenuOption
  active: boolean
  branchActive: boolean
  open: boolean
  hasChildren: boolean
  popup: boolean
  horizontalRoot: boolean
  collapsedRoot: boolean
  controls?: string
}>()

const emit = defineEmits<{
  activate: [event: MouseEvent]
  keydown: [event: KeyboardEvent]
}>()

const ns = useNamespace('menu-node')
const controlTag = computed(() =>
  props.option.href && !props.hasChildren ? 'a' : 'button',
)
const arrowIcon = computed(() =>
  props.horizontalRoot || !props.popup ? 'cb:chevron-down' : 'cb:chevron-right',
)

const activate = (event: MouseEvent) => {
  if (props.option.disabled) {
    event.preventDefault()
    return
  }
  emit('activate', event)
}
</script>

<template>
  <component
    :is="controlTag"
    :class="ns.e('button')"
    :type="controlTag === 'button' ? 'button' : undefined"
    :href="controlTag === 'a' ? option.href : undefined"
    :target="controlTag === 'a' ? option.target : undefined"
    :disabled="controlTag === 'button' ? option.disabled : undefined"
    :tabindex="controlTag === 'a' && option.disabled ? -1 : undefined"
    :aria-disabled="option.disabled || undefined"
    :aria-current="active && controlTag === 'a' ? 'page' : undefined"
    :aria-expanded="hasChildren ? open : undefined"
    :aria-controls="hasChildren ? controls : undefined"
    :aria-haspopup="hasChildren && popup ? 'true' : undefined"
    @click="activate"
    @keydown="emit('keydown', $event)"
  >
    <SIcon v-if="option.icon" :name="option.icon" :class="ns.e('icon')" />
    <span :class="ns.e('content')">
      <span :class="ns.e('label')">{{ option.label }}</span>
      <small v-if="option.description" :class="ns.e('description')">
        {{ option.description }}
      </small>
    </span>
    <span v-if="option.badge !== undefined" :class="ns.e('badge')">
      {{ option.badge }}
    </span>
    <span
      v-if="branchActive && !active && !collapsedRoot"
      :class="ns.e('branch-dot')"
      aria-hidden="true"
    />
    <SIcon
      v-if="hasChildren"
      :class="[ns.e('arrow'), ns.is('horizontal-root-arrow', horizontalRoot)]"
      :name="arrowIcon"
    />
  </component>
</template>
