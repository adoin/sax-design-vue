<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import type { CSSProperties } from 'vue'
import type { CountdownEffect } from './countdown'

defineOptions({ name: 'SCountdownDigit' })

const props = defineProps<{
  value: string
  effect: CountdownEffect
  delay: number
}>()

const ns = useNamespace('countdown')
const previousValue = shallowRef(props.value)
const revision = shallowRef(0)
const isAnimating = shallowRef(false)
const isChanging = computed(
  () => isAnimating.value && previousValue.value !== props.value,
)

const completionAnimations: Partial<Record<CountdownEffect, string>> = {
  flip: 's-countdown-flip-bottom',
  fade: 's-countdown-fade-new',
  particle: 's-countdown-particle-new',
  slide: 's-countdown-slide-new',
}

const particles = [
  { x: '-0.82em', y: '-0.52em' },
  { x: '-0.4em', y: '-0.72em' },
  { x: '0.08em', y: '-0.78em' },
  { x: '0.55em', y: '-0.62em' },
  { x: '0.82em', y: '-0.2em' },
  { x: '0.72em', y: '0.42em' },
  { x: '0.32em', y: '0.7em' },
  { x: '-0.18em', y: '0.76em' },
  { x: '-0.64em', y: '0.52em' },
  { x: '-0.78em', y: '0.08em' },
  { x: '0.34em', y: '-0.34em' },
  { x: '-0.28em', y: '0.28em' },
] as const

const digitStyle = computed(
  () =>
    ({
      '--s-countdown-digit-delay': `${props.delay}ms`,
    }) as CSSProperties,
)

const particleStyle = (index: number) =>
  ({
    '--s-countdown-particle-x': particles[index].x,
    '--s-countdown-particle-y': particles[index].y,
    '--s-countdown-particle-delay': `${index * 9}ms`,
  }) as CSSProperties

const finishAnimation = () => {
  previousValue.value = props.value
  isAnimating.value = false
}

const handleAnimationEnd = (event: AnimationEvent) => {
  if (event.animationName !== completionAnimations[props.effect]) return
  finishAnimation()
}

watch(
  () => props.value,
  (value, oldValue) => {
    if (value === oldValue) return
    previousValue.value = oldValue
    revision.value += 1
    isAnimating.value = props.effect !== 'default'
  },
)

watch(() => props.effect, finishAnimation)
</script>

<template>
  <span
    :class="[
      ns.e('digit'),
      ns.em('digit', props.effect),
      ns.is('changing', isChanging),
    ]"
    :style="digitStyle"
    aria-hidden="true"
  >
    <span
      v-if="props.effect === 'default' || !isChanging"
      :class="ns.e('value')"
    >
      {{ props.value }}
    </span>

    <span
      v-else-if="props.effect === 'flip'"
      :key="`flip-${revision}`"
      :class="[ns.e('motion-frame'), ns.em('motion-frame', 'flip')]"
      @animationend="handleAnimationEnd"
    >
      <span :class="[ns.e('value'), ns.em('value', 'base')]">
        {{ props.value }}
      </span>
      <span
        :class="[ns.e('flip-half'), ns.em('flip-half', 'top'), ns.is('old')]"
      >
        <span :class="ns.e('flip-half-value')">{{ previousValue }}</span>
      </span>
      <span
        :class="[ns.e('flip-half'), ns.em('flip-half', 'bottom'), ns.is('old')]"
      >
        <span :class="ns.e('flip-half-value')">{{ previousValue }}</span>
      </span>
      <span
        :class="[ns.e('flip-half'), ns.em('flip-half', 'bottom'), ns.is('new')]"
      >
        <span :class="ns.e('flip-half-value')">{{ props.value }}</span>
      </span>
      <span :class="ns.e('flip-crease')" />
    </span>

    <span
      v-else
      :key="`${props.effect}-${revision}`"
      :class="[ns.e('motion-frame'), ns.em('motion-frame', props.effect)]"
      @animationend="handleAnimationEnd"
    >
      <span :class="[ns.e('value'), ns.em('value', 'old')]">
        {{ previousValue }}
      </span>
      <span :class="[ns.e('value'), ns.em('value', 'new')]">
        {{ props.value }}
      </span>
      <template v-if="props.effect === 'particle'">
        <span
          v-for="(_, index) in particles"
          :key="index"
          :class="ns.e('particle')"
          :style="particleStyle(index)"
        />
      </template>
    </span>
  </span>
</template>
