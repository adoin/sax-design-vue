<script setup lang="ts">
import { useSlots } from 'vue'
import {
  IconClose,
  IconControlLoading,
  SIcon,
} from '@vuesax-alpha/components/icon'
import SScrollbar from '@vuesax-alpha/components/scrollbar'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import type { DrawerContent, DrawerProps, DrawerSlotScope } from './drawer'
defineProps<{
  options: DrawerProps
  scope: DrawerSlotScope
  showClose: boolean
  loadingVisible: boolean
  guardShown: boolean
  guardActive: boolean
  shape: string
}>()
const emit = defineEmits<{ close: [event: MouseEvent] }>()
const slots = useSlots()
const ns = useNamespace('drawer')
const { t } = useLocale()
const Content = (props: { value: DrawerContent }) =>
  typeof props.value === 'function' ? props.value() : props.value
</script>

<template>
  <header
    v-if="options.withHeader"
    :class="[ns.e('header'), options.headerClass, options.classNames?.header]"
    :style="[options.headerStyle, options.styles?.header]"
  >
    <div :class="ns.e('heading')">
      <slot name="header" v-bind="scope">
        <div
          v-if="options.title || slots.title"
          :id="scope.titleId"
          :class="scope.titleClass"
          role="heading"
          :aria-level="options.headerAriaLevel"
        >
          <slot name="title" v-bind="scope"
            ><Content :value="options.title"
          /></slot>
        </div>
      </slot>
    </div>
    <div v-if="options.extra || slots.extra" :class="ns.e('extra')">
      <slot name="extra" v-bind="scope"
        ><Content :value="options.extra"
      /></slot>
    </div>
    <button
      v-if="showClose"
      type="button"
      :class="ns.e('close')"
      :aria-label="t('vs.common.close')"
      :disabled="scope.closePending"
      :aria-busy="scope.closePending || undefined"
      @click="emit('close', $event)"
    >
      <IconControlLoading
        v-if="guardShown"
        :active="guardActive"
        :shape="shape"
      />
      <slot v-else name="close-icon" v-bind="scope">
        <SIcon
          v-if="typeof options.closeIcon === 'string'"
          :name="options.closeIcon"
          :size="18"
        />
        <Content
          v-else-if="options.closeIcon"
          :value="options.closeIcon"
        /><IconClose v-else :size="18" hover="less" />
      </slot>
    </button>
  </header>
  <button
    v-else-if="showClose"
    type="button"
    :class="[ns.e('close'), ns.em('close', 'floating')]"
    :aria-label="t('vs.common.close')"
    :disabled="scope.closePending"
    @click="emit('close', $event)"
  >
    <IconControlLoading
      v-if="guardShown"
      :active="guardActive"
      :shape="shape"
    />
    <slot v-else name="close-icon" v-bind="scope"
      ><SIcon
        v-if="typeof options.closeIcon === 'string'"
        :name="options.closeIcon"
        :size="18" /><Content
        v-else-if="options.closeIcon"
        :value="options.closeIcon" /><IconClose v-else :size="18" hover="less"
    /></slot>
  </button>
  <SScrollbar
    :class="ns.e('scrollbar')"
    height="100%"
    :wrap-class="ns.e('scroll-wrap')"
  >
    <div
      :class="[
        ns.e('body'),
        options.bodyClass,
        options.classNames?.body,
        { [ns.is('loading')]: loadingVisible },
      ]"
      :style="[options.bodyStyle, options.styles?.body]"
      :aria-busy="loadingVisible || undefined"
    >
      <div v-if="loadingVisible" :class="ns.e('loading')">
        <slot name="loading" v-bind="scope"
          ><IconControlLoading
            :active="options.loading && scope.open"
            :shape="shape"
        /></slot>
      </div>
      <div v-show="!loadingVisible" :class="ns.e('content')">
        <slot v-bind="scope" />
      </div>
    </div>
  </SScrollbar>
  <footer
    v-if="slots.footer || options.footer"
    :class="[ns.e('footer'), options.footerClass, options.classNames?.footer]"
    :style="[options.footerStyle, options.styles?.footer]"
  >
    <slot name="footer" v-bind="scope"
      ><Content :value="options.footer"
    /></slot>
  </footer>
</template>
