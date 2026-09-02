<template>
  <li
    :class="[
      ns.e('item'),
      ns.is('preview', Boolean(preview || previewSrcList.length)),
    ]"
    :style="itemStyle"
    :role="canPreview ? 'button' : undefined"
    :tabindex="canPreview ? 0 : undefined"
    @click="openPreview"
    @keydown.enter.prevent="openPreview"
    @keydown.space.prevent="openPreview"
  >
    <div :class="ns.e('wrap')" :style="wrapStyle">
      <img
        v-bind="$attrs"
        :src="src"
        :alt="alt"
        :class="[
          ns.e('img'),
          ns.is('loading', isLoading),
          ns.is('error', isError),
        ]"
        :style="imageStyle"
        :loading="loading"
        :decoding="decoding"
        @load="handleLoad"
        @error="handleError"
      />

      <div v-if="isLoading && !isError" :class="ns.e('placeholder')">
        <slot name="placeholder">
          <span :class="ns.e('skeleton')" aria-hidden="true" />
        </slot>
      </div>

      <div
        v-if="isError"
        :class="ns.e('error')"
        :role="alt ? 'img' : undefined"
        :aria-label="alt || undefined"
      >
        <slot name="error">
          <span :class="ns.e('error-mark')" aria-hidden="true" />
        </slot>
      </div>
    </div>
    <img
      v-if="!isLoading && !isError"
      :src="src"
      :class="ns.e('blur')"
      :style="imageStyle"
      alt=""
      aria-hidden="true"
    />
    <s-image-preview
      v-model="previewVisible"
      :url-list="resolvedPreviewList"
      :initial-index="initialIndex"
    />
  </li>
</template>

<script lang="ts" setup>
import { computed, shallowRef, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import SImagePreview from '@vuesax-alpha/components/image-preview'
import { addUnit } from '@vuesax-alpha/utils'
import { imageEmits, imageProps } from './image'

defineOptions({
  name: 'SImage',
  inheritAttrs: false,
})

const props = defineProps(imageProps)
const emit = defineEmits(imageEmits)

const ns = useNamespace('images')

const imageStyle = computed(() => ({
  objectFit: props.fit,
  objectPosition: props.position,
}))
const itemStyle = computed(() => ({
  width: props.width ? addUnit(props.width) : undefined,
  height: props.height ? addUnit(props.height) : undefined,
}))
const wrapStyle = computed(() => ({
  aspectRatio: props.height ? 'auto' : String(props.aspectRatio),
  height: props.height ? '100%' : undefined,
}))
const isLoading = shallowRef(Boolean(props.src))
const isError = shallowRef(false)
const previewVisible = shallowRef(false)
const resolvedPreviewList = computed(() =>
  props.previewSrcList.length
    ? props.previewSrcList
    : props.src
      ? [props.src]
      : [],
)
const canPreview = computed(() =>
  Boolean(props.preview || props.previewSrcList.length),
)

watch(
  () => props.src,
  (src) => {
    isLoading.value = Boolean(src)
    isError.value = false
  },
)

const handleLoad = (event: Event) => {
  isLoading.value = false
  isError.value = false
  emit('load', event)
}

const handleError = (event: Event) => {
  isLoading.value = false
  isError.value = true
  emit('error', event)
}

const openPreview = () => {
  if (!canPreview.value) return
  previewVisible.value = true
  emit('preview')
}
</script>
