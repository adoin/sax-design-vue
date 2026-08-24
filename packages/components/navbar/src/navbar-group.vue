<template>
  <div
    ref="groupRef"
    :class="[ns.b(), ns.is('active', isGroupActive), ns.is('open', open)]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusout="handleFocusOut"
    @keydown.esc="close"
  >
    <button
      type="button"
      :class="ns.e('trigger')"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="handleClick"
    >
      <span :class="ns.e('label')"><slot /></span>
      <svg :class="ns.e('chevron')" viewBox="0 0 16 16" aria-hidden="true">
        <path d="m4.5 6 3.5 3.5L11.5 6" />
      </svg>
    </button>

    <div
      v-show="open"
      :class="ns.e('items')"
      role="menu"
      @mouseenter="keepOpen"
      @mouseleave="scheduleClose"
    >
      <slot name="items" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, provide, reactive, ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import {
  navbarContextKey,
  navbarGroupRegisterContextKey,
} from '@vuesax-alpha/tokens/navbar'

defineOptions({ name: 'SNavbarGroup' })

const { modelValue } = inject(navbarContextKey)!
const ns = useNamespace('navbar-group')
const groupRef = ref<HTMLElement>()
const open = ref(false)
const children = reactive<Set<string>>(new Set())
const isGroupActive = computed(() => children.has(`${modelValue.value}`))
let hoverTimer: ReturnType<typeof setTimeout> | undefined
const openDelay = 100
const closeDelay = 160

const clearHoverTimer = () => {
  if (hoverTimer) clearTimeout(hoverTimer)
  hoverTimer = undefined
}

const close = () => {
  clearHoverTimer()
  open.value = false
}

const handleMouseEnter = () => {
  clearHoverTimer()
  if (open.value) return

  hoverTimer = setTimeout(() => {
    open.value = true
    hoverTimer = undefined
  }, openDelay)
}

const keepOpen = () => clearHoverTimer()

const scheduleClose = () => {
  clearHoverTimer()
  hoverTimer = setTimeout(() => {
    open.value = false
    hoverTimer = undefined
  }, closeDelay)
}

const handleMouseLeave = () => scheduleClose()

const handleClick = () => {
  clearHoverTimer()
  open.value = !open.value
}

const handleFocusOut = (event: FocusEvent) => {
  if (!groupRef.value?.contains(event.relatedTarget as Node | null)) close()
}

provide(navbarGroupRegisterContextKey, (id: string) => {
  children.add(id)

  return {
    unregister: () => children.delete(id),
  }
})

onBeforeUnmount(clearHoverTimer)
</script>
