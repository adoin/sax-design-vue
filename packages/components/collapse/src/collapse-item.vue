<template>
  <div
    :class="[ns.b(), ns.is('open', isOpen), ns.is('disabled', disabled)]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <header :class="ns.e('header')" @click="toggleContent">
      <slot name="header" />
      <span v-if="!notArrow" :class="ns.e('icon')">
        <VsIcon :icon="iconArrow" :icon-pack="iconPack" />
      </span>
    </header>
    <div ref="contentRef" :class="ns.e('content')" :style="contentStyle">
      <div :class="ns.e('body')">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { collapseItemProps } from './collapse-item'
import { collapseContextKey } from './constants'

defineOptions({
  name: 'VsCollapseItem',
})

const props = defineProps(collapseItemProps)

const ns = useNamespace('collapse-item')
const collapse = inject(collapseContextKey)!
const itemId = Symbol('collapse-item')
const contentRef = ref<HTMLElement>()
const maxHeight = ref('0px')

const isOpen = computed(() => collapse.isItemOpen(itemId))

const contentStyle = computed(() => ({
  maxHeight: maxHeight.value,
}))

const updateHeight = () => {
  if (!contentRef.value) return
  const scrollHeight = contentRef.value.scrollHeight
  maxHeight.value = isOpen.value ? `${scrollHeight}px` : '0px'
}

const toggleContent = () => {
  if (collapse.openHover || props.disabled) return
  collapse.toggleItem(itemId, !isOpen.value)
}

const handleMouseEnter = () => {
  if (!collapse.openHover || props.disabled) return
  collapse.toggleItem(itemId, true)
}

const handleMouseLeave = () => {
  if (!collapse.openHover) return
  collapse.toggleItem(itemId, false)
}

watch(isOpen, () => {
  updateHeight()
})

onMounted(() => {
  if (props.open) {
    collapse.toggleItem(itemId, true)
  }
  window.addEventListener('resize', updateHeight)
  updateHeight()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeight)
})
</script>
