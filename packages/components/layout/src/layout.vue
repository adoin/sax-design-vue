<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import LayoutAside from './aside.vue'
import LayoutBody from './body.vue'
import LayoutContainer from './container.vue'
import LayoutFooter from './footer.vue'
import LayoutHeader from './header.vue'
import { layoutProps, normalizeLayoutSize } from './layout'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SLayout' })

const props = defineProps(layoutProps)
const emit = defineEmits<{
  'update:asideOutsideCollapsed': [value: boolean]
  'aside-outside-collapse': [value: boolean]
}>()
const slots = defineSlots<{
  header?(): unknown
  aside?(): unknown
  'aside-outside'?(props: { collapsed: boolean; toggle: () => void }): unknown
  default?(): unknown
  footer?(): unknown
}>()

const ns = useNamespace('layout')

const rootStyle = computed(
  () =>
    ({
      '--s-layout-gap': normalizeLayoutSize(props.gap),
      '--s-layout-padding': normalizeLayoutSize(props.padding),
      '--s-layout-min-height': normalizeLayoutSize(props.minHeight),
    }) as CSSProperties,
)
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.m(props.asidePosition),
      ns.is('responsive', props.responsive),
      ns.is('sticky-header', props.stickyHeader),
    ]"
    :style="rootStyle"
  >
    <LayoutHeader
      v-if="slots.header"
      :size="props.headerHeight"
      :sticky="props.stickyHeader"
      :sticky-offset="props.stickyHeaderOffset ?? props.padding"
      :z-index="props.stickyHeaderZIndex"
    >
      <slot name="header" />
    </LayoutHeader>

    <LayoutContainer
      v-if="slots.aside || slots['aside-outside'] || slots.default"
      :class="ns.e('content')"
      :gap="props.gap"
    >
      <LayoutAside
        v-if="slots.aside || slots['aside-outside']"
        :size="props.asideWidth"
        :outside-position="props.asidePosition === 'start' ? 'end' : 'start'"
        :outside-collapsible="props.asideOutsideCollapsible"
        :outside-collapsed="props.asideOutsideCollapsed"
        @update:outside-collapsed="emit('update:asideOutsideCollapsed', $event)"
        @outside-collapse="emit('aside-outside-collapse', $event)"
      >
        <slot name="aside" />

        <template
          v-if="slots['aside-outside']"
          #outside="{ collapsed, toggle }"
        >
          <slot name="aside-outside" :collapsed="collapsed" :toggle="toggle" />
        </template>
      </LayoutAside>

      <LayoutBody v-if="slots.default">
        <slot />
      </LayoutBody>
    </LayoutContainer>

    <LayoutFooter v-if="slots.footer" :size="props.footerHeight">
      <slot name="footer" />
    </LayoutFooter>
  </div>
</template>
