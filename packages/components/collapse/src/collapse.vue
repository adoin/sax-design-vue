<template>
  <div :class="[ns.b(), type && ns.m(type)]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { collapseEmits, collapseProps } from './collapse'
import { collapseContextKey } from './constants'

defineOptions({
  name: 'VsCollapse',
})

const props = defineProps(collapseProps)
const emit = defineEmits(collapseEmits)

const ns = useNamespace('collapse')
const activeItems = ref<Set<symbol>>(new Set())

const closeAllItems = (except?: symbol) => {
  if (!props.accordion) return
  activeItems.value.forEach((id) => {
    if (id !== except) {
      activeItems.value.delete(id)
    }
  })
}

const toggleItem = (id: symbol, open: boolean) => {
  if (props.accordion && open) {
    closeAllItems(id)
  }
  if (open) {
    activeItems.value.add(id)
  } else {
    activeItems.value.delete(id)
  }
  emit('change')
}

const isItemOpen = (id: symbol) => activeItems.value.has(id)

provide(collapseContextKey, {
  accordion: props.accordion,
  openHover: props.openHover,
  toggleItem,
  isItemOpen,
})
</script>
