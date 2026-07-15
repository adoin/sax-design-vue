<template>
  <div
    :class="[
      ns.b(),
      themeColorClass,
      ns.m(`position-${position}`),
      ns.m(`align-${alignment}`),
    ]"
    :style="rootStyle"
  >
    <div :class="ns.e('nav-wrap')">
      <ul ref="navRef" :class="ns.e('nav')">
        <li
          v-for="(pane, index) in panes"
          :key="pane.uid"
          :class="[ns.e('item'), ns.is('active', index === activeIndex)]"
          @click="setActiveIndex(index)"
        >
          <button :class="ns.e('btn')" type="button" :disabled="pane.disabled">
            <SIcon v-if="pane.icon" :icon="pane.icon" />
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
import { SIcon } from '@vuesax-alpha/components/icon'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { tabsContextKey } from './constants'
import { tabsEmits, tabsProps } from './tabs'
import type { TabPaneContext } from './constants'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'STabs',
})

const props = defineProps(tabsProps)
const emit = defineEmits(tabsEmits)

const ns = useNamespace('tabs')
const panes = ref<TabPaneContext[]>([])
const navRef = ref<HTMLElement>()
const activeIndex = ref(0)
const lineStyle = ref<Record<string, string>>({})

const themeColor = computed(() => normalizeVsColor(props.color))
const isThemeColor = computed(() => isVsColor(themeColor.value))
const themeColorClass = computed(() =>
  isThemeColor.value ? ns.m(themeColor.value) : ''
)

const customColor = computed(() => {
  if (isThemeColor.value) return ''
  const c = getVsColor(props.color)
  if (!c) return ''
  return c.startsWith('var(') ? c : `rgb(${c})`
})

const rootStyle = computed((): CSSProperties => {
  if (!customColor.value) return {}
  return { '--s-tabs-color': customColor.value } as CSSProperties
})

const resolveIndex = (val: string | number) => {
  if (typeof val === 'number') return val
  const idx = panes.value.findIndex((item) => item.label === val)
  return idx >= 0 ? idx : 0
}

const setActiveIndex = (index: number) => {
  const pane = panes.value[index]
  if (!pane || pane.disabled) return
  activeIndex.value = index
  emit('update:modelValue', index)
  emit('change', index)
  nextTick(updateLine)
}

const registerPane = (pane: TabPaneContext) => {
  panes.value.push(pane)
  const index = panes.value.length - 1
  if (index === 0) {
    const initial = resolveIndex(props.modelValue)
    activeIndex.value = initial
  }
  nextTick(updateLine)
  return index
}

const unregisterPane = (uid: number) => {
  const removedIndex = panes.value.findIndex((pane) => pane.uid === uid)
  panes.value = panes.value.filter((pane) => pane.uid !== uid)
  if (removedIndex >= 0 && activeIndex.value >= panes.value.length) {
    activeIndex.value = Math.max(0, panes.value.length - 1)
  }
  nextTick(updateLine)
}

const updateLine = () => {
  const nav = navRef.value
  if (!nav) return
  const activeEl = nav.querySelector(`.${ns.is('active')}`) as HTMLElement
  if (!activeEl) return

  if (props.position === 'left' || props.position === 'right') {
    lineStyle.value = {
      top: `${activeEl.offsetTop}px`,
      height: `${activeEl.offsetHeight}px`,
      width: '2px',
      left: props.position === 'left' ? 'auto' : '',
      right: props.position === 'right' ? '0' : '',
      bottom: 'auto',
    }
    if (props.position === 'left') {
      lineStyle.value.right = '0'
      delete lineStyle.value.left
    }
  } else {
    lineStyle.value = {
      left: `${activeEl.offsetLeft}px`,
      width: `${activeEl.offsetWidth}px`,
      top: props.position === 'bottom' ? '0' : '',
      bottom: props.position === 'bottom' ? 'auto' : '0',
      height: '2px',
    }
  }
}

watch(
  () => props.modelValue,
  (val) => {
    const index = resolveIndex(val)
    if (index >= 0 && index < panes.value.length) {
      activeIndex.value = index
      nextTick(updateLine)
    }
  }
)

watch(
  () => props.position,
  () => nextTick(updateLine)
)

provide(tabsContextKey, {
  activeIndex,
  setActiveIndex,
  registerPane,
  unregisterPane,
})

onMounted(updateLine)
</script>
