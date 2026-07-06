<template>
  <div v-show="isActive" :class="ns.e('pane')">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  watch,
} from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { tabsContextKey } from './constants'
import { tabProps } from './tab'

defineOptions({
  name: 'VsTab',
  inheritAttrs: false,
})

const props = defineProps(tabProps)

const ns = useNamespace('tabs')
const tabs = inject(tabsContextKey)!
const instance = getCurrentInstance()!
const uid = instance.uid

const isActive = computed(() => tabs.currentName.value === props.label)

onMounted(() => {
  tabs.registerPane({
    uid,
    label: props.label,
    icon: props.icon,
    disabled: props.disabled,
    vnode: instance.vnode,
  })
})

onBeforeUnmount(() => {
  tabs.unregisterPane(uid)
})

watch(
  () => props.label,
  (label) => {
    if (isActive.value) {
      tabs.setCurrentName(label)
    }
  }
)
</script>
