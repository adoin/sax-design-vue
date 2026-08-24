<script lang="ts" setup>
import { computed, provide, ref, toRef, watch } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import SMenuNode from './menu-node.vue'
import { menuContextKey } from './menu-context'
import { createMenuTreeIndex, menuEmits, menuProps } from './menu'

import type { MenuKey, MenuOption } from './menu'

defineOptions({ name: 'SMenu' })

const props = defineProps(menuProps)
const emit = defineEmits(menuEmits)
const ns = useNamespace('menu')
const { t } = useLocale()
const internalOpenKeys = ref<MenuKey[]>([...props.defaultOpeneds])

const current = computed(() => props.modelValue)
const openKeys = computed(() => props.openKeys ?? internalOpenKeys.value)
const mode = computed(() => props.mode)
const submenuMode = computed(
  () =>
    props.submenuMode ??
    (props.mode === 'horizontal' || props.collapse ? 'popup' : 'inline'),
)
const trigger = computed(
  () => props.trigger ?? (submenuMode.value === 'popup' ? 'hover' : 'click'),
)
const treeIndex = computed(() => createMenuTreeIndex(props.options))

const updateOpenKeys = (keys: MenuKey[]) => {
  const next = [...new Set(keys)]
  if (props.openKeys === undefined) internalOpenKeys.value = next
  emit('update:openKeys', next)
}

const closeBranches = (keys: MenuKey[]) => {
  if (!keys.length) return
  updateOpenKeys(openKeys.value.filter((key) => !keys.includes(key)))
  keys.forEach((key) => emit('close', key))
}

const setOpen = (option: MenuOption, expanded: boolean) => {
  const key = option.key
  const currentlyOpen = openKeys.value.includes(key)
  if (expanded === currentlyOpen) return

  const descendants = treeIndex.value.descendants.get(key) ?? []
  if (!expanded) {
    closeBranches(
      [key, ...descendants].filter((item) => openKeys.value.includes(item)),
    )
    return
  }

  let next = [...openKeys.value]
  if (props.uniqueOpen) {
    const siblings = treeIndex.value.siblings.get(key) ?? []
    const siblingBranches = siblings
      .filter((sibling) => sibling !== key)
      .reduce<MenuKey[]>((keys, sibling) => {
        keys.push(sibling, ...(treeIndex.value.descendants.get(sibling) ?? []))
        return keys
      }, [])
    next = next.filter((item) => !siblingBranches.includes(item))
  }

  updateOpenKeys([...next, key])
  emit('open', key)
}

const closeAllPopups = () => {
  if (
    submenuMode.value !== 'popup' &&
    props.mode !== 'horizontal' &&
    !props.collapse
  ) {
    return
  }
  closeBranches([...openKeys.value])
}

const select = (option: MenuOption) => {
  emit('update:modelValue', option.key)
  emit('select', option.key, option)
  if (props.closeOnSelect) closeAllPopups()
}

provide(menuContextKey, {
  current,
  openKeys,
  mode,
  submenuMode,
  trigger,
  collapse: toRef(props, 'collapse'),
  selectableParents: toRef(props, 'selectableParents'),
  teleported: toRef(props, 'teleported'),
  showDelay: toRef(props, 'showDelay'),
  hideDelay: toRef(props, 'hideDelay'),
  popupOffset: toRef(props, 'popupOffset'),
  popupClass: toRef(props, 'popupClass'),
  select,
  setOpen,
})

watch(
  () => props.defaultOpeneds,
  (value) => {
    if (props.openKeys === undefined) internalOpenKeys.value = [...value]
  },
)
</script>

<template>
  <nav
    :class="[ns.b(), ns.m(mode), ns.m(variant), ns.is('collapse', collapse)]"
    :aria-label="t('vs.menu.label')"
  >
    <ul :class="ns.e('list')">
      <SMenuNode
        v-for="item in options"
        :key="item.key"
        :option="item"
        :level="0"
      />
    </ul>
  </nav>
</template>
