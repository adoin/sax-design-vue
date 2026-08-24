<script setup lang="ts">
import { computed } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import type { Placement } from '@vuesax-alpha/hooks/use-floating/vue'
import type { TabPaneContext } from './constants'

type OverflowSide = 'leading' | 'trailing'

const props = defineProps<{
  panes: TabPaneContext[]
  position: 'top' | 'bottom'
  side: OverflowSide
  visible: boolean
}>()

const emit = defineEmits<{
  select: [pane: TabPaneContext, event: MouseEvent]
  'update:visible': [visible: boolean]
}>()

const ns = useNamespace('tabs')
const { t } = useLocale()

const placement = computed<Placement>(() => {
  const vertical = props.position === 'bottom' ? 'top' : 'bottom'
  const alignment = props.side === 'leading' ? 'start' : 'end'
  return `${vertical}-${alignment}` as Placement
})
</script>

<template>
  <div
    :class="[ns.e('item'), ns.e('overflow-slot')]"
    :data-overflow-side="side"
  >
    <SPopper
      :visible="visible"
      trigger="click"
      :placement="placement"
      strategy="fixed"
      :offset="8"
      :show-arrow="false"
      popper-class="s-tabs__overflow-popper"
      @update:visible="emit('update:visible', $event)"
    >
      <button
        :class="[ns.e('btn'), ns.e('more')]"
        type="button"
        :aria-label="t('vs.tabs.more')"
        aria-haspopup="menu"
        :aria-expanded="visible"
      >
        <slot name="icon">
          <SIcon name="cb:overflow-menu-horizontal" />
        </slot>
        <span :class="ns.e('overflow-count')">{{ panes.length }}</span>
      </button>

      <template #content>
        <div :class="ns.e('overflow-menu')" role="menu">
          <button
            v-for="pane in panes"
            :key="pane.uid"
            :class="ns.e('overflow-item')"
            type="button"
            role="menuitem"
            :disabled="pane.disabled"
            @click="emit('select', pane, $event)"
          >
            <SIcon v-if="pane.icon" :name="pane.icon" />
            <span>{{ pane.label }}</span>
            <span v-if="pane.badge !== undefined" :class="ns.e('badge')">
              {{ pane.badge }}
            </span>
          </button>
        </div>
      </template>
    </SPopper>
  </div>
</template>
