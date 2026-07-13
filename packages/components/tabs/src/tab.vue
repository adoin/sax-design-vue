<template>
  <transition :name="transitionName">
    <div v-show="isActive" :class="ns.e('pane')">
      <slot />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
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
const paneIndex = ref(-1)

const isActive = computed(() => tabs.activeIndex.value === paneIndex.value)
const transitionName = computed(() => ns.e('pane-fade'))

onMounted(() => {
  paneIndex.value = tabs.registerPane({
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
</script>
