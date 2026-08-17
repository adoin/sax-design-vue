<template>
  <nav
    :class="[ns.b(), ns.m(`align-${align}`)]"
    :aria-label="t('vs.breadcrumb.label')"
  >
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
              [ns.is('has-children')]: item.children?.length,
            },
          ]"
          :aria-current="item.active ? 'page' : undefined"
        >
          <s-popper
            v-if="item.children?.length"
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
                v-if="!item.active && !item.disabled"
                :href="item.url || '#'"
                :title="item.title"
                :class="ns.e('link')"
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
              >
                {{ item.title }}
              </span>
              <span :class="ns.e('menu-trigger')" aria-hidden="true" />
            </span>
            <template #content>
              <breadcrumb-tree-menu :items="item.children" :trigger="trigger" />
            </template>
          </s-popper>
          <template v-else>
            <a
              v-if="!item.active && !item.disabled"
              :href="item.url || '#'"
              :title="item.title"
              :class="ns.e('link')"
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
            >
              {{ item.title }}
            </span>
          </template>
          <span
            v-if="!item.active"
            :class="ns.e('separator')"
            aria-hidden="true"
          >
            <SIcon
              v-if="isIconSeparator(separator)" :name="separator"
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
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { breadcrumbProps } from './breadcrumb'
import { breadcrumbContextKey } from './constants'
import BreadcrumbTreeMenu from './breadcrumb-tree-menu.vue'

defineOptions({
  name: 'SBreadcrumb',
})

const props = defineProps(breadcrumbProps)

const ns = useNamespace('breadcrumb')
const { t } = useLocale()

const isIconSeparator = (sep: string) => sep.length > 1

const themeColor = computed(() => normalizeVsColor(props.color))

const textColorClass = computed(() =>
  isVsColor(themeColor.value) ? ns.em('text', themeColor.value) : '',
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
