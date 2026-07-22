<template>
  <li
    :class="[
      ns.b(),
      ns.is('open', isOpen),
      ns.is('active', active),
      ns.is('disabled', option.disabled),
      ns.is('has-children', hasChildren),
    ]"
  >
    <button
      :class="ns.e('button')"
      type="button"
      :disabled="option.disabled"
      @click="activate"
    >
      <SIcon
        v-if="option.icon"
        :icon="option.icon"
        icon-pack="material-icons"
      />
      <span :class="ns.e('label')">{{ option.label }}</span>
      <SIcon
        v-if="hasChildren"
        :class="ns.e('arrow')"
        icon="expand_more"
        icon-pack="material-icons"
      />
    </button>
    <ul v-if="hasChildren" :class="ns.e('children')">
      <SMenuNode
        v-for="item in option.children"
        :key="item.key"
        :option="item"
        :current="current"
        :open-keys="openKeys"
        :mode="mode"
        :collapse="collapse"
        :selectable-parents="selectableParents"
        @select="emit('select', $event)"
        @toggle="emit('toggle', $event)"
      />
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import type { MenuKey, MenuOption } from './menu'

defineOptions({ name: 'SMenuNode' })

const props = defineProps<{
  option: MenuOption
  current: MenuKey | undefined
  openKeys: MenuKey[]
  mode: 'vertical' | 'horizontal'
  collapse: boolean
  selectableParents: boolean
}>()
const emit = defineEmits<{
  select: [option: MenuOption]
  toggle: [option: MenuOption]
}>()
const ns = useNamespace('menu-node')
const hasChildren = computed(() => !!props.option.children?.length)
const active = computed(() => props.option.key === props.current)
const isOpen = computed(() => props.openKeys.includes(props.option.key))
const activate = () => {
  if (props.option.disabled) return
  if (hasChildren.value) {
    emit('toggle', props.option)
    if (!props.selectableParents) return
  }
  emit('select', props.option)
}
</script>
