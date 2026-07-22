<template>
  <Teleport to="body">
    <Transition name="s-image-preview-fade">
      <div
        v-if="modelValue"
        :class="ns.b()"
        :style="{ zIndex }"
        role="dialog"
        aria-modal="true"
        aria-label="Image preview"
        @click.self="onModalClick"
      >
        <button
          :class="ns.e('close')"
          type="button"
          aria-label="Close"
          @click="close"
        >
          <SIcon icon="close" icon-pack="material-icons" />
        </button>
        <button
          v-if="showPrevious"
          :class="[ns.e('arrow'), ns.e('arrow-left')]"
          type="button"
          aria-label="Previous image"
          @click="previous"
        >
          <SIcon icon="chevron_left" icon-pack="material-icons" />
        </button>
        <img :class="ns.e('image')" :src="currentUrl" alt="" />
        <button
          v-if="showNext"
          :class="[ns.e('arrow'), ns.e('arrow-right')]"
          type="button"
          aria-label="Next image"
          @click="next"
        >
          <SIcon icon="chevron_right" icon-pack="material-icons" />
        </button>
        <div v-if="urlList.length > 1" :class="ns.e('counter')">
          {{ activeIndex + 1 }} / {{ urlList.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { imagePreviewEmits, imagePreviewProps } from './image-preview'

defineOptions({ name: 'SImagePreview' })

const props = defineProps(imagePreviewProps)
const emit = defineEmits(imagePreviewEmits)
const ns = useNamespace('image-preview')
const activeIndex = ref(0)
const currentUrl = computed(() => props.urlList[activeIndex.value] ?? '')
const showPrevious = computed(() => props.infinite || activeIndex.value > 0)
const showNext = computed(
  () => props.infinite || activeIndex.value < props.urlList.length - 1,
)
const setIndex = (index: number) => {
  const length = props.urlList.length
  if (!length) return
  activeIndex.value = props.infinite
    ? (index + length) % length
    : Math.min(Math.max(index, 0), length - 1)
  emit('switch', activeIndex.value)
}
const previous = () => setIndex(activeIndex.value - 1)
const next = () => setIndex(activeIndex.value + 1)
const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
const onModalClick = () => {
  if (props.hideOnClickModal) close()
}
const onKeydown = (event: KeyboardEvent) => {
  if (!props.modelValue) return
  if (event.key === 'Escape') close()
  if (event.key === 'ArrowLeft') previous()
  if (event.key === 'ArrowRight') next()
}

watch(
  () => [props.modelValue, props.initialIndex, props.urlList.length],
  () => {
    if (props.modelValue) setIndex(props.initialIndex)
  },
  { immediate: true },
)
onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

defineExpose({ close, next, previous, setIndex })
</script>
