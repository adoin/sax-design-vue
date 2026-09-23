<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import { getCssColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import BreadcrumbTreeMenu from './breadcrumb-tree-menu.vue'
import type { BreadcrumbItem } from './breadcrumb'
import type { PopperTriggerType } from '@vuesax-alpha/components/popper'

defineOptions({ name: 'BreadcrumbItemNode' })

const props = defineProps<{
  item: BreadcrumbItem
  isLast: boolean
  separator: string
  color: string
  trigger: PopperTriggerType | PopperTriggerType[]
}>()
const emit = defineEmits<{ navigate: [] }>()

const ns = useNamespace('breadcrumb')
const { t } = useLocale()
const menuOpen = shallowRef(false)
const hasChildren = computed(() => Boolean(props.item.children?.length))
const isIconSeparator = computed(() => props.separator.length > 1)
const textColorClass = computed(() => {
  const color = normalizeVsColor(props.color)
  return isVsColor(color) ? ns.em('text', color) : ''
})
const textStyle = computed(() => {
  if (!props.color || isVsColor(normalizeVsColor(props.color))) return
  const color = getCssColor(props.color)
  return color ? { color } : undefined
})
</script>

<template>
  <li
    :class="[
      ns.e('item'),
      ns.is('active', item.active),
      ns.is('disabled', item.disabled),
      ns.is('has-children', hasChildren),
      ns.is('last', isLast),
    ]"
    :aria-current="item.active ? 'page' : undefined"
  >
    <SPopper
      v-if="hasChildren && !item.disabled"
      v-model:visible="menuOpen"
      :trigger="trigger"
      placement="bottom-start"
      strategy="fixed"
      :offset="8"
      :hide-after="120"
      :show-arrow="false"
      persistent
      popper-class="s-breadcrumb__tree-popper"
    >
      <span :class="ns.e('tree-trigger')">
        <a
          v-if="!item.active"
          :href="item.url || '#'"
          :title="item.title"
          :class="ns.e('link')"
          @click.stop="emit('navigate')"
        >
          {{ item.title }}
        </a>
        <span
          v-else
          :class="[ns.e('text'), textColorClass]"
          :style="textStyle"
          :title="item.title"
        >
          {{ item.title }}
        </span>
        <button
          type="button"
          :class="ns.e('menu-toggle')"
          :aria-label="`${t('vs.breadcrumb.expandChildren')}: ${item.title}`"
          aria-haspopup="menu"
          :aria-expanded="menuOpen"
          @click.stop="menuOpen = !menuOpen"
        >
          <span :class="ns.e('menu-trigger')" aria-hidden="true" />
        </button>
      </span>
      <template #content>
        <BreadcrumbTreeMenu
          :items="item.children!"
          :trigger="trigger"
          @navigate="emit('navigate')"
        />
      </template>
    </SPopper>
    <template v-else>
      <a
        v-if="!item.active && !item.disabled"
        :href="item.url || '#'"
        :title="item.title"
        :class="ns.e('link')"
        @click="emit('navigate')"
      >
        {{ item.title }}
      </a>
      <span
        v-else-if="!item.active && item.disabled"
        :class="[ns.e('link'), ns.is('disabled')]"
        :title="item.title"
      >
        {{ item.title }}
      </span>
      <span
        v-else
        :class="[ns.e('text'), textColorClass]"
        :style="textStyle"
        :title="item.title"
      >
        {{ item.title }}
      </span>
    </template>
    <span v-if="!isLast" :class="ns.e('separator')" aria-hidden="true">
      <SIcon v-if="isIconSeparator" :name="separator" />
      <template v-else>{{ separator }}</template>
    </span>
  </li>
</template>
