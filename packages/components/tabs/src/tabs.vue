<template>
  <div
    :class="[
      ns.b(),
      ns.m(props.color),
      ns.m(`position-${position}`),
      ns.m(`align-${alignment}`),
    ]"
  >
    <div :class="ns.e('nav-wrap')">
      <ul ref="navRef" :class="ns.e('nav')">
        <li
          v-for="pane in panes"
          :key="pane.uid"
          :class="[ns.e('item'), ns.is('active', pane.uid === activeUid)]"
          @click="setActive(pane.uid)"
        >
          <button :class="ns.e('btn')" type="button" :disabled="pane.disabled">
            <VsIcon v-if="pane.icon" :icon="pane.icon" />
            <span>{{ pane.label }}</span>
          </button>
        </li>
      </ul>
      <span :class="ns.e('line')" :style="lineStyle" />
    </div>
    <div :class="ns.e('content')">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, provide, ref, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { tabsContextKey } from './constants'
import { tabsEmits, tabsProps } from './tabs'
import type { TabPaneContext } from './constants'

defineOptions({
  name: 'VsTabs',
})

const props = defineProps(tabsProps)
const emit = defineEmits(tabsEmits)

const ns = useNamespace('tabs')
const panes = ref<TabPaneContext[]>([])
const navRef = ref<HTMLElement>()
const activeUid = ref<number>(0)
const lineStyle = ref<Record<string, string>>({})

const currentName = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const registerPane = (pane: TabPaneContext) => {
  panes.value.push(pane)
  if (activeUid.value === 0) {
    activeUid.value = pane.uid
    currentName.value = pane.label
  }
  nextTick(updateLine)
}

const unregisterPane = (uid: number) => {
  panes.value = panes.value.filter((pane) => pane.uid !== uid)
}

const setActive = (uid: number) => {
  const pane = panes.value.find((item) => item.uid === uid)
  if (!pane || pane.disabled) return
  activeUid.value = uid
  currentName.value = pane.label
  nextTick(updateLine)
}

const updateLine = () => {
  const nav = navRef.value
  if (!nav) return
  const activeEl = nav.querySelector(`.${ns.is('active')}`) as HTMLElement
  if (!activeEl) return
  lineStyle.value = {
    left: `${activeEl.offsetLeft}px`,
    width: `${activeEl.offsetWidth}px`,
  }
}

watch(
  () => props.modelValue,
  (val) => {
    const pane = panes.value.find((item) => item.label === val)
    if (pane) {
      activeUid.value = pane.uid
      nextTick(updateLine)
    }
  }
)

provide(tabsContextKey, {
  currentName,
  setCurrentName: (name) => {
    currentName.value = name
  },
  registerPane,
  unregisterPane,
})

onMounted(updateLine)
</script>
