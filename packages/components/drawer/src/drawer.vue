<template>
  <teleport :disabled="!teleported" to="body">
    <transition name="s-drawer-mask"
      ><div v-if="modelValue" :class="ns.e('mask')" @click="onMask"
    /></transition>
    <transition
      :name="`s-drawer-${placement}`"
      @after-enter="$emit('open')"
      @after-leave="$emit('close')"
    >
      <aside
        v-if="modelValue"
        :class="[ns.b(), ns.m(placement)]"
        :style="style"
        role="dialog"
        aria-modal="true"
      >
        <header v-if="title || $slots.header" :class="ns.e('header')">
          <slot name="header">{{ title }}</slot
          ><button
            v-if="showClose"
            type="button"
            :class="ns.e('close')"
            aria-label="Close"
            @click="close"
          >
            ×
          </button>
        </header>
        <div :class="ns.e('body')"><slot /></div>
        <footer v-if="$slots.footer" :class="ns.e('footer')">
          <slot name="footer" />
        </footer>
      </aside>
    </transition>
  </teleport>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { drawerEmits, drawerProps } from './drawer'
defineOptions({ name: 'SDrawer' })
const props = defineProps(drawerProps)
const emit = defineEmits(drawerEmits)
const ns = useNamespace('drawer')
const style = computed(() =>
  ['left', 'right'].includes(props.placement)
    ? { width: typeof props.size === 'number' ? `${props.size}px` : props.size }
    : {
        height: typeof props.size === 'number' ? `${props.size}px` : props.size,
      },
)
const close = () => emit('update:modelValue', false)
const onMask = () => {
  if (props.maskClosable) close()
}
</script>
