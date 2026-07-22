<template>
  <span ref="triggerRef" :class="ns.b()" @contextmenu.prevent="show">
    <slot />
  </span>
  <Teleport to="body">
    <Transition name="s-context-menu-fade">
      <div
        v-if="open"
        ref="menuRef"
        :class="ns.e('panel')"
        :style="panelStyle"
        role="menu"
        @contextmenu.prevent
      >
        <button
          v-for="(item, index) in items"
          :key="item.value ?? `${item.label}-${index}`"
          :class="[ns.e('item'), { 'is-divided': item.divided }]"
          type="button"
          role="menuitem"
          :disabled="item.disabled"
          @click="select(item)"
        >
          <SIcon
            v-if="item.icon"
            :icon="item.icon"
            icon-pack="material-icons"
          />
          <span>{{ item.label }}</span>
        </button>
        <slot name="menu" :close="close" />
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { contextMenuEmits, contextMenuProps } from './context-menu'
import type { ContextMenuItem } from './context-menu'

defineOptions({ name: 'SContextMenu' })

const props = defineProps(contextMenuProps)
const emit = defineEmits(contextMenuEmits)
const ns = useNamespace('context-menu')
const triggerRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const open = ref(props.modelValue)
const point = ref({ x: 0, y: 0 })
const position = ref({ x: 0, y: 0 })
const panelStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  minWidth: `${props.minWidth}px`,
}))

const updatePosition = async () => {
  position.value = { ...point.value }
  await nextTick()
  const rect = menuRef.value?.getBoundingClientRect()
  if (!rect) return
  position.value = {
    x: Math.max(8, Math.min(point.value.x, window.innerWidth - rect.width - 8)),
    y: Math.max(
      8,
      Math.min(point.value.y, window.innerHeight - rect.height - 8),
    ),
  }
}
const setOpen = (value: boolean) => {
  if (open.value === value) return
  open.value = value
  emit('update:modelValue', value)
  if (!value) emit('close')
}
const show = (event: MouseEvent) => {
  if (props.disabled) return
  point.value = { x: event.clientX, y: event.clientY }
  setOpen(true)
  emit('open', event)
  updatePosition()
}
const close = () => setOpen(false)
const select = (item: ContextMenuItem) => {
  if (item.disabled) return
  emit('select', item)
  if (!item.keepOpen) close()
}
const onPointerDown = (event: PointerEvent) => {
  const target = event.target as Node
  if (!triggerRef.value?.contains(target) && !menuRef.value?.contains(target))
    close()
}
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  (value) => {
    open.value = value
    if (value) updatePosition()
  },
)
onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
})

defineExpose({ close })
</script>
