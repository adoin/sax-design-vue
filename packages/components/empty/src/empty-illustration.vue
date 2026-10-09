<script setup lang="ts">
import { computed, shallowRef, useId, useTemplateRef, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { useEmptyMotion } from './use-empty-motion'
import EmptyFlap from './empty-flap.vue'
import EmptySurprise from './empty-surprise.vue'
import { emptyBox, emptyFlaps } from './empty-geometry'

const props = defineProps<{ animated: boolean }>()
const ns = useNamespace('empty')
const scene = useTemplateRef<SVGSVGElement>('scene')
// Vue's app-scoped IDs keep gradient references unique and hydration-stable.
const id = `s-empty-${useId()}`
const paint = (name: string) => `url(#${id}-${name})`
const completed = shallowRef(false)
const { playing, reducedMotion } = useEmptyMotion(
  scene,
  () => props.animated && !completed.value,
)
const animate = computed(
  () => props.animated && !completed.value && !reducedMotion.value,
)
watch(
  () => props.animated,
  () => {
    completed.value = false
  },
)
watch(
  [scene, playing, animate],
  (_value, _previous, onCleanup) => {
    const svg = scene.value
    if (!svg) return
    const completion = svg.querySelector('[data-empty-completion]')
    const finish = () => {
      completed.value = true
    }
    completion?.addEventListener('endEvent', finish)
    onCleanup(() => completion?.removeEventListener('endEvent', finish))
    if (!animate.value) svg.setCurrentTime?.(0)
    if (playing.value) svg.unpauseAnimations?.()
    else svg.pauseAnimations?.()
  },
  { flush: 'post', immediate: true },
)
</script>

<template>
  <svg
    ref="scene"
    :class="[
      ns.e('illustration'),
      ns.is('animated', animated),
      ns.is('paused', !playing),
    ]"
    viewBox="0 0 260 200"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <radialGradient :id="`${id}-halo`">
        <stop
          :class="ns.e('tone-accent')"
          stop-color="currentColor"
          stop-opacity=".09"
        />
        <stop
          offset="1"
          :class="ns.e('tone-accent')"
          stop-color="currentColor"
          stop-opacity="0"
        />
      </radialGradient>
      <linearGradient
        :id="`${id}-flap`"
        x1="75"
        y1="45"
        x2="130"
        y2="130"
        gradientUnits="userSpaceOnUse"
      >
        <stop :class="ns.e('tone-paper')" stop-color="currentColor" />
        <stop offset="1" :class="ns.e('tone-tint')" stop-color="currentColor" />
      </linearGradient>
      <linearGradient
        :id="`${id}-inside`"
        x1="128"
        y1="78"
        x2="128"
        y2="127"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          :class="ns.e('tone-accent')"
          stop-color="currentColor"
          stop-opacity=".16"
        />
        <stop
          offset="1"
          :class="ns.e('tone-accent')"
          stop-color="currentColor"
          stop-opacity=".06"
        />
      </linearGradient>
      <linearGradient
        :id="`${id}-front`"
        x1="80"
        y1="137"
        x2="185"
        y2="182"
        gradientUnits="userSpaceOnUse"
      >
        <stop :class="ns.e('tone-paper')" stop-color="currentColor" />
        <stop offset="1" :class="ns.e('tone-tint')" stop-color="currentColor" />
      </linearGradient>
    </defs>

    <ellipse cx="128" cy="108" rx="114" ry="84" :fill="paint('halo')" />
    <g :class="ns.e('orbit')" stroke="currentColor" stroke-linecap="round">
      <path
        d="M28 93C23 124 35 149 57 161M204 40C222 50 233 69 236 86"
        stroke-dasharray="2 7"
      />
      <path d="M30 153H40M217 158H229" opacity=".6" />
      <circle cx="38" cy="58" r="2" />
      <circle cx="219" cy="131" r="2" />
    </g>
    <ellipse
      :class="ns.e('ground')"
      cx="129"
      cy="160"
      rx="73"
      ry="9"
      transform="rotate(9 129 160)"
      fill="currentColor"
    />

    <ellipse
      :class="ns.e('contact-shadow')"
      cx="129"
      cy="159"
      rx="51"
      ry="4"
      transform="rotate(9 129 159)"
      fill="currentColor"
    />
    <g :class="ns.e('tray')" stroke-linejoin="round">
      <path :d="emptyBox.opening" :fill="paint('inside')" />
      <path
        :d="emptyBox.floor"
        :class="ns.e('tone-surface')"
        fill="currentColor"
      />
      <path :d="emptyBox.floor" fill="currentColor" fill-opacity=".06" />
      <path
        :d="emptyBox.backWall"
        fill="currentColor"
        fill-opacity=".12"
        stroke="currentColor"
        stroke-opacity=".2"
      />
      <path
        :d="emptyBox.leftWall"
        fill="currentColor"
        fill-opacity=".05"
        stroke="currentColor"
        stroke-opacity=".2"
      />
      <path
        :d="emptyBox.rim"
        stroke="currentColor"
        stroke-opacity=".3"
        stroke-width="1.5"
      />
    </g>
    <EmptyFlap
      v-for="flap in emptyFlaps"
      :key="flap.side"
      :flap="flap"
      :paint="paint('flap')"
      :animated="animate"
    />
    <g :class="ns.e('tray')" stroke-linejoin="round">
      <path
        :d="emptyBox.right"
        :fill="paint('front')"
        stroke="currentColor"
        stroke-opacity=".3"
        stroke-width="1.5"
      />
      <path :d="emptyBox.right" fill="currentColor" fill-opacity=".08" />
      <path
        :d="emptyBox.front"
        :fill="paint('front')"
        stroke="currentColor"
        stroke-opacity=".3"
        stroke-width="1.5"
      />
      <path
        :d="emptyBox.frontHighlight"
        :class="ns.e('tone-surface')"
        stroke="currentColor"
        stroke-width="2"
        stroke-opacity=".8"
      />
      <path
        :d="emptyBox.rightHighlight"
        :class="ns.e('tone-surface')"
        stroke="currentColor"
        stroke-width="2"
        stroke-opacity=".55"
      />
      <path
        :d="emptyBox.label"
        fill="currentColor"
        fill-opacity=".08"
        transform="translate(0 1)"
      />
      <path
        :d="emptyBox.label"
        :class="ns.e('tone-paper')"
        fill="currentColor"
      />
      <path
        :d="emptyBox.label"
        stroke="currentColor"
        stroke-opacity=".12"
        stroke-width="1"
      />
      <path
        :d="emptyBox.handle"
        stroke="currentColor"
        stroke-opacity=".22"
        stroke-width="1.7"
        stroke-linecap="round"
      />
    </g>
    <g :class="ns.e('spark')" fill="currentColor">
      <circle cx="55" cy="36" r="1.5" opacity=".5" />
      <circle cx="201" cy="31" r="2" opacity=".55" />
      <circle cx="227" cy="145" r="1.5" opacity=".4" />
    </g>
    <EmptySurprise v-if="animate" />
  </svg>
</template>
