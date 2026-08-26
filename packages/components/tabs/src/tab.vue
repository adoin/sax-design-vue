<script lang="ts" setup>
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useSlots,
  watch,
} from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { tabsContextKey } from './constants'
import { tabProps } from './tab'

defineOptions({
  name: 'STab',
  inheritAttrs: false,
})

const props = defineProps(tabProps)
const slots = useSlots()
const ns = useNamespace('tabs')
const tabs = inject(tabsContextKey)
const instance = getCurrentInstance()

if (!tabs || !instance) throw new Error('[STab] must be used inside STabs')

const uid = instance.uid
const isActive = computed(() => tabs.activeUid.value === uid)
const hasRendered = shallowRef(false)
const shouldRender = computed(() => {
  if (props.forceRender) return true
  if (tabs.destroyOnHide.value) return isActive.value
  if (!tabs.lazy.value) return true
  return hasRendered.value
})
const transitionName = computed(() =>
  tabs.animated.value ? ns.e('pane-fade') : undefined,
)

const paneData = () => ({
  uid,
  name: props.name,
  label: props.label,
  icon: props.icon,
  badge: props.badge,
  disabled: props.disabled,
  closable: props.closable,
  renderLabel: slots.label,
})

onMounted(() => tabs.registerPane(paneData()))

watch(
  () => [
    props.name,
    props.label,
    props.icon,
    props.badge,
    props.disabled,
    props.closable,
  ],
  () => tabs.updatePane(uid, paneData()),
)

watch(
  isActive,
  (active) => {
    if (active) hasRendered.value = true
  },
  { immediate: true },
)

onBeforeUnmount(() => tabs.unregisterPane(uid))
</script>

<template>
  <Transition :name="transitionName">
    <div
      v-if="shouldRender"
      v-show="isActive"
      :id="tabs.panelId(uid)"
      :class="ns.e('pane')"
      role="tabpanel"
      :aria-labelledby="tabs.tabId(uid)"
      :tabindex="isActive ? 0 : -1"
    >
      <slot />
    </div>
  </Transition>
</template>
