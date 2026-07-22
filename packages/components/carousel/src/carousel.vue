<template>
  <section
    :class="[
      ns.b(),
      ns.m(`arrow-${arrow}`),
      ns.m(`indicator-${indicatorPosition}`),
    ]"
    :style="rootStyle"
    role="region"
    aria-roledescription="carousel"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <div :class="ns.e('viewport')">
      <div :class="ns.e('track')" :style="trackStyle">
        <article
          v-for="(item, index) in items"
          :key="`${item.src || item.title || 'slide'}-${index}`"
          :class="[ns.e('item'), ns.is('active', index === current)]"
          :aria-hidden="index !== current"
        >
          <slot
            name="item"
            :item="item"
            :index="index"
            :active="index === current"
          >
            <img
              v-if="item.src"
              :class="ns.e('image')"
              :src="item.src"
              :alt="item.alt || item.title || ''"
            />
            <div v-if="item.title || item.description" :class="ns.e('caption')">
              <strong v-if="item.title">{{ item.title }}</strong>
              <span v-if="item.description">{{ item.description }}</span>
            </div>
          </slot>
        </article>
      </div>
      <button
        v-if="showArrows"
        :class="[ns.e('arrow'), ns.e('arrow-prev')]"
        type="button"
        aria-label="Previous slide"
        @click="previous"
      >
        <SIcon icon="chevron_left" icon-pack="material-icons" />
      </button>
      <button
        v-if="showArrows"
        :class="[ns.e('arrow'), ns.e('arrow-next')]"
        type="button"
        aria-label="Next slide"
        @click="next"
      >
        <SIcon icon="chevron_right" icon-pack="material-icons" />
      </button>
      <div v-if="showIndicators" :class="ns.e('indicators')" role="tablist">
        <button
          v-for="(_, index) in items"
          :key="index"
          :class="[ns.e('indicator'), ns.is('active', index === current)]"
          type="button"
          role="tab"
          :aria-label="`Go to slide ${index + 1}`"
          :aria-selected="index === current"
          @click="setCurrent(index)"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { addUnit } from '@vuesax-alpha/utils'
import { carouselEmits, carouselProps } from './carousel'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SCarousel' })

const props = defineProps(carouselProps)
const emit = defineEmits(carouselEmits)
const ns = useNamespace('carousel')
const current = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const rootStyle = computed<CSSProperties>(() => ({
  height: addUnit(props.height),
}))
const trackStyle = computed(() => ({
  transform: `translateX(-${current.value * 100}%)`,
}))
const showArrows = computed(
  () => props.arrow !== 'never' && props.items.length > 1,
)
const showIndicators = computed(
  () => props.indicatorPosition !== 'none' && props.items.length > 1,
)

const normalizeIndex = (index: number) => {
  const length = props.items.length
  if (!length) return 0
  if (props.loop) return (index + length) % length
  return Math.min(Math.max(index, 0), length - 1)
}

const setCurrent = (index: number) => {
  const nextIndex = normalizeIndex(index)
  const previousIndex = current.value
  if (nextIndex === previousIndex) return
  current.value = nextIndex
  emit('update:modelValue', nextIndex)
  emit('change', nextIndex, previousIndex)
}

const previous = () => setCurrent(current.value - 1)
const next = () => setCurrent(current.value + 1)

const stopTimer = () => {
  if (timer) clearInterval(timer)
  timer = undefined
}

const startTimer = () => {
  stopTimer()
  if (!props.autoplay || props.items.length < 2 || props.interval <= 0) return
  timer = setInterval(next, props.interval)
}

const pause = () => {
  if (props.pauseOnHover) stopTimer()
}

const resume = () => {
  if (props.pauseOnHover) startTimer()
}

watch(
  () => props.modelValue,
  (value) => {
    current.value = normalizeIndex(value)
  },
  { immediate: true },
)

watch(
  () => [props.items.length, props.autoplay, props.interval],
  () => {
    current.value = normalizeIndex(current.value)
    startTimer()
  },
)

onMounted(startTimer)
onBeforeUnmount(stopTimer)
</script>
