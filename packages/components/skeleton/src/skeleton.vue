<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { skeletonProps } from './skeleton'
import { defaultSkeletonRows, skeletonLength } from './skeleton-layout'
import SkeletonLayout from './skeleton-layout.vue'
defineOptions({ name: 'SSkeleton' })
const props = defineProps(skeletonProps)
const ns = useNamespace('skeleton')
const { t } = useLocale()
const layout = computed(() => props.rows ?? defaultSkeletonRows)
const repetitions = computed(() =>
  Number.isFinite(props.repeat) ? Math.max(1, Math.floor(props.repeat)) : 1,
)
const style = computed(() => ({
  '--sax-skeleton-gap': skeletonLength(props.gap),
}))
function showEnteringContent(element: Element) {
  element.removeAttribute('aria-hidden')
  element.removeAttribute('inert')
}
function hideLeavingContent(element: Element) {
  element.setAttribute('aria-hidden', 'true')
  element.setAttribute('inert', '')
}
</script>
<template>
  <div :class="[ns.b(), ns.m(animation)]" :style="style" :aria-busy="loading">
    <span v-if="loading" class="s-skeleton__status" role="status">{{
      label ?? t('vs.skeleton.loading')
    }}</span>
    <Transition
      name="s-skeleton-reveal"
      @before-enter="showEnteringContent"
      @before-leave="hideLeavingContent"
    >
      <div v-if="loading" key="placeholder" class="s-skeleton__placeholder">
        <div class="s-skeleton__placeholder-content" aria-hidden="true">
          <slot name="placeholder">
            <SkeletonLayout
              v-for="index in repetitions"
              :key="index"
              :rows="layout"
            />
          </slot>
        </div>
      </div>
      <div v-else key="content" class="s-skeleton__content"><slot /></div>
    </Transition>
  </div>
</template>
