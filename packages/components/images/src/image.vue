<template>
  <li
    :class="[ns.e('item'), ns.is('preview', preview || previewSrcList.length)]"
    :style="itemStyle"
    @click="openPreview"
  >
    <div :class="ns.e('wrap')">
      <div :class="ns.e('img')" :style="styleImage" />
    </div>
    <img
      :src="src"
      :class="ns.e('blur')"
      :alt="alt"
      @load="emit('load', $event)"
      @error="emit('error', $event)"
    />
    <s-image-preview
      v-model="previewVisible"
      :url-list="resolvedPreviewList"
      :initial-index="initialIndex"
    />
  </li>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
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

const styleImage = computed(() => ({
  backgroundImage: props.src ? `url(${props.src})` : undefined,
  backgroundSize: props.fit === 'fill' ? '100% 100%' : props.fit,
}))
const itemStyle = computed(() => ({
  width: props.width ? addUnit(props.width) : undefined,
  height: props.height ? addUnit(props.height) : undefined,
}))
const previewVisible = ref(false)
const resolvedPreviewList = computed(() =>
  props.previewSrcList.length
    ? props.previewSrcList
    : props.src
      ? [props.src]
      : [],
)
const openPreview = () => {
  if (!props.preview && !props.previewSrcList.length) return
  previewVisible.value = true
  emit('preview')
}
</script>
