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
            {{ separator }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { getVsColor, isVsColor } from '@vuesax-alpha/utils'
import { breadcrumbProps } from './breadcrumb'

defineOptions({
  name: 'VsBreadcrumb',
})

const props = defineProps(breadcrumbProps)

const ns = useNamespace('breadcrumb')

const textColorClass = computed(() =>
  isVsColor(props.color) ? ns.em('text', props.color) : ''
)

const textStyle = computed(() => {
  if (!isVsColor(props.color)) {
    return { color: getVsColor(props.color) }
  }
  return undefined
})
</script>
