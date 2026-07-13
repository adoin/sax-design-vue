<template>
  <nav :class="[ns.b(), ns.m(`align-${align}`)]" aria-label="breadcrumb">
    <ol :class="ns.e('list')">
      <slot />
      <template v-if="!$slots.default">
        <li
          v-for="item in items"
          :key="item.title"
          :class="[
            ns.e('item'),
            {
              [ns.is('active')]: item.active,
              [ns.is('disabled')]: item.disabled,
            },
          ]"
          :aria-current="item.active ? 'page' : undefined"
        >
          <a
            v-if="!item.active"
            :href="item.url || '#'"
            :title="item.title"
            :class="ns.e('link')"
          >
            {{ item.title }}
          </a>
          <span
            v-else
            :class="[ns.e('text'), textColorClass]"
            :style="textStyle"
          >
            {{ item.title }}
          </span>
          <span
            v-if="!item.active"
            :class="ns.e('separator')"
            aria-hidden="true"
          >
            <VsIcon
              v-if="isIconSeparator(separator)"
              :icon="separator"
              icon-pack="material-icons"
            />
            <template v-else>{{ separator }}</template>
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import { computed, provide, toRef } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { VsIcon } from '@vuesax-alpha/components/icon'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { breadcrumbProps } from './breadcrumb'
import { breadcrumbContextKey } from './constants'

defineOptions({
  name: 'VsBreadcrumb',
})

const props = defineProps(breadcrumbProps)

const ns = useNamespace('breadcrumb')

const isIconSeparator = (sep: string) => sep.length > 1

const themeColor = computed(() => normalizeVsColor(props.color))

const textColorClass = computed(() =>
  isVsColor(themeColor.value) ? ns.em('text', themeColor.value) : ''
)

const textStyle = computed(() => {
  if (!props.color || isVsColor(themeColor.value)) {
    return undefined
  }
  const resolved = getVsColor(props.color)
  if (!resolved) return undefined
  return {
    color: resolved.startsWith('var(') ? resolved : `rgb(${resolved})`,
  }
})

provide(breadcrumbContextKey, {
  separator: toRef(props, 'separator'),
  color: toRef(props, 'color'),
})
</script>
