<template>
  <ul :class="ns.e('menu')" role="menu">
    <li
      v-for="item in items"
      :key="item.title"
      :class="[
        ns.e('menu-item'),
        {
          [ns.is('disabled')]: item.disabled,
          [ns.is('has-children')]: item.children?.length,
        },
      ]"
      role="none"
    >
      <s-popper
        v-if="item.children?.length"
        :trigger="trigger"
        placement="right-start"
        strategy="fixed"
        :offset="8"
        :hide-after="120"
        :show-arrow="false"
        persistent
        popper-class="s-breadcrumb__tree-popper"
      >
        <span :class="ns.e('menu-trigger-wrap')">
          <a
            v-if="!item.disabled"
            :href="item.url || '#'"
            :class="ns.e('menu-link')"
            role="menuitem"
          >
            {{ item.title }}
          </a>
          <span v-else :class="ns.e('menu-link')" role="menuitem">
            {{ item.title }}
          </span>
          <span :class="ns.e('menu-trigger')" aria-hidden="true" />
        </span>
        <template #content>
          <breadcrumb-tree-menu :items="item.children" :trigger="trigger" />
        </template>
      </s-popper>
      <a
        v-else-if="!item.disabled"
        :href="item.url || '#'"
        :class="ns.e('menu-link')"
        role="menuitem"
      >
        {{ item.title }}
      </a>
      <span v-else :class="ns.e('menu-link')" role="menuitem">
        {{ item.title }}
      </span>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { definePropType } from '@vuesax-alpha/utils'
import { useNamespace } from '@vuesax-alpha/hooks'
import { SPopper } from '@vuesax-alpha/components/popper'
import type { BreadcrumbItem } from './breadcrumb'
import type { PopperTriggerType } from '@vuesax-alpha/components/popper'

defineOptions({ name: 'BreadcrumbTreeMenu' })

defineProps({
  items: {
    type: definePropType<BreadcrumbItem[]>(Array),
    required: true,
  },
  trigger: {
    type: definePropType<PopperTriggerType | PopperTriggerType[]>([
      String,
      Array,
    ]),
    required: true,
  },
})

const ns = useNamespace('breadcrumb')
</script>
