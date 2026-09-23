<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import BreadcrumbItemNode from './breadcrumb-item-node.vue'
import type { BreadcrumbItem } from './breadcrumb'
import type { PopperTriggerType } from '@vuesax-alpha/components/popper'

defineOptions({ name: 'BreadcrumbOverflow' })

defineProps<{
  items: BreadcrumbItem[]
  hiddenItems: BreadcrumbItem[]
  separator: string
  color: string
  trigger: PopperTriggerType | PopperTriggerType[]
}>()

const ns = useNamespace('breadcrumb')
const { t } = useLocale()
const visible = shallowRef(false)
const mode = shallowRef<'preview' | 'full'>('preview')
const expanded = computed(() => visible.value && mode.value === 'full')

watch(visible, (open) => {
  if (!open) mode.value = 'preview'
})

const showPreview = () => {
  if (expanded.value) return
  mode.value = 'preview'
  visible.value = true
}

const hidePreview = () => {
  if (!expanded.value) visible.value = false
}

const toggleFull = () => {
  if (expanded.value) {
    visible.value = false
    return
  }
  mode.value = 'full'
  visible.value = true
}

const closeFull = () => {
  visible.value = false
}
</script>

<template>
  <li :class="[ns.e('item'), ns.e('overflow')]">
    <SPopper
      v-model:visible="visible"
      :trigger="[]"
      placement="bottom-start"
      strategy="fixed"
      :offset="8"
      :show-arrow="false"
      :outside-click-ignore="[
        '.s-breadcrumb__overflow-trigger',
        '.s-breadcrumb__tree-popper',
      ]"
      persistent
      popper-class="s-breadcrumb__overflow-popper"
    >
      <button
        type="button"
        :class="ns.e('overflow-trigger')"
        :aria-label="`${t('vs.breadcrumb.hiddenLevels')}: ${hiddenItems.length}`"
        :aria-expanded="expanded"
        @mouseenter="showPreview"
        @mouseleave="hidePreview"
        @focus="showPreview"
        @blur="hidePreview"
        @click="toggleFull"
        @keydown.esc.stop="closeFull"
      >
        <span aria-hidden="true">…</span>
      </button>
      <template #content>
        <div v-if="!expanded" :class="ns.e('overflow-preview')" role="tooltip">
          <ol>
            <li v-for="(item, index) in items" :key="`${item.title}-${index}`">
              <span
                v-if="index"
                :class="ns.e('overflow-preview-separator')"
                aria-hidden="true"
              >
                <SIcon v-if="separator.length > 1" :name="separator" />
                <template v-else>{{ separator }}</template>
              </span>
              <span :class="ns.e('overflow-preview-label')">{{
                item.title
              }}</span>
            </li>
          </ol>
        </div>
        <div
          v-else
          :class="ns.e('overflow-panel')"
          @keydown.esc.stop="closeFull"
        >
          <div :class="ns.e('overflow-heading')">
            <strong>{{ t('vs.breadcrumb.fullTrail') }}</strong>
            <button
              type="button"
              :aria-label="t('vs.breadcrumb.closeFullTrail')"
              @click="closeFull"
            >
              <SIcon name="bx:x" aria-hidden="true" />
            </button>
          </div>
          <nav :aria-label="t('vs.breadcrumb.fullTrail')">
            <ol :class="ns.e('overflow-list')">
              <BreadcrumbItemNode
                v-for="(item, index) in items"
                :key="`${item.title}-${index}`"
                :item="item"
                :is-last="index === items.length - 1"
                :separator="separator"
                :color="color"
                :trigger="trigger"
                @navigate="closeFull"
              />
            </ol>
          </nav>
        </div>
      </template>
    </SPopper>
    <span :class="ns.e('separator')" aria-hidden="true">
      <SIcon v-if="separator.length > 1" :name="separator" />
      <template v-else>{{ separator }}</template>
    </span>
  </li>
</template>
