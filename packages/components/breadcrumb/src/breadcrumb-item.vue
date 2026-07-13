<template>
  <li
    :class="[
      ns.e('item'),
      ns.is('active', active),
      ns.is('disabled', disabled),
    ]"
    :aria-current="active ? 'page' : undefined"
  >
    <a v-if="!active && to" :href="to" :class="ns.e('link')">
      <slot />
    </a>
    <span
      v-else
      :class="[ns.e('text'), activeTextColorClass]"
      :style="activeTextStyle"
    >
      <slot />
    </span>
    <span v-if="!active && !hideSeparator" :class="ns.e('separator')">
      <slot name="separator">
        <VsIcon
          v-if="isIconSeparator(resolvedSeparator)"
          :icon="resolvedSeparator"
          icon-pack="material-icons"
        />
        <template v-else>{{ resolvedSeparator }}</template>
      </slot>
    </span>
  </li>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { breadcrumbItemProps } from './breadcrumb-item'
import { breadcrumbContextKey } from './constants'

defineOptions({
  name: 'VsBreadcrumbItem',
})

const props = defineProps(breadcrumbItemProps)

const ns = useNamespace('breadcrumb')
const breadcrumb = inject(breadcrumbContextKey, null)

const isIconSeparator = (sep: string) => sep.length > 1

const resolvedSeparator = computed(
  () => props.separator ?? breadcrumb?.separator.value ?? '/'
)

const themeColor = computed(() =>
  normalizeVsColor(breadcrumb?.color.value || 'primary')
)

const activeTextColorClass = computed(() =>
  props.active && isVsColor(themeColor.value)
    ? ns.em('text', themeColor.value)
    : ''
)

const activeTextStyle = computed(() => {
  if (!props.active || isVsColor(themeColor.value)) return undefined
  return { color: getVsColor(breadcrumb?.color.value || 'primary') }
})
</script>
