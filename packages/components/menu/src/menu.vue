<template>
  <nav
    :class="[ns.b(), ns.m(mode), ns.is('collapse', collapse)]"
    aria-label="Menu"
  >
    <ul :class="ns.e('list')">
      <SMenuNode
        v-for="item in options"
        :key="item.key"
        :option="item"
        :current="modelValue"
        :open-keys="openKeys"
        :mode="mode"
        :collapse="collapse"
        :selectable-parents="selectableParents"
        @select="select"
        @toggle="toggle"
      />
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import SMenuNode from './menu-node.vue'
import { menuEmits, menuProps } from './menu'
import type { MenuKey, MenuOption } from './menu'

defineOptions({ name: 'SMenu' })

const props = defineProps(menuProps)
const emit = defineEmits(menuEmits)
const ns = useNamespace('menu')
const openKeys = ref<MenuKey[]>([...props.defaultOpeneds])
const select = (option: MenuOption) => {
  emit('update:modelValue', option.key)
  emit('select', option.key, option)
}
const toggle = (option: MenuOption) => {
  const index = openKeys.value.indexOf(option.key)
  if (index >= 0) {
    openKeys.value = openKeys.value.filter((key) => key !== option.key)
    emit('close', option.key)
    return
  }
  openKeys.value = props.uniqueOpen
    ? [option.key]
    : [...openKeys.value, option.key]
  emit('open', option.key)
}
watch(
  () => props.defaultOpeneds,
  (value) => {
    openKeys.value = [...value]
  },
)
</script>
