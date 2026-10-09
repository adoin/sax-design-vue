<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { useEmptyMotion } from './use-empty-motion'

const props = defineProps<{ animated: boolean }>()
const ns = useNamespace('empty')
const scene = useTemplateRef<SVGSVGElement>('scene')
// Vue's app-scoped IDs keep gradient/clip references unique and hydration-stable.
const id = `s-empty-${useId()}`
const paint = (name: string) => `url(#${id}-${name})`
const playing = useEmptyMotion(scene, () => props.animated)
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
          stop-opacity=".12"
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
        <stop :class="ns.e('tone-surface')" stop-color="currentColor" />
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
          stop-opacity=".24"
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
        <stop :class="ns.e('tone-surface')" stop-color="currentColor" />
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
      cy="177"
      rx="85"
      ry="8"
      fill="currentColor"
    />

    <g :class="ns.e('flap-back')" data-motion="flap-back">
      <path
        d="M78 78L66 49C65 46 68 44 72 44H182C186 44 188 46 186 50L177 78Z"
        :fill="paint('flap')"
        stroke="currentColor"
        stroke-opacity=".3"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M71 49H181M78 74H177"
        stroke="currentColor"
        stroke-opacity=".14"
        stroke-linecap="round"
      />
      <path
        d="M71 50L82 72M180 50L173 72"
        :class="ns.e('tone-surface')"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>

    <g :class="ns.e('tray')">
      <path
        d="M78 78H177L201 127H55Z"
        :fill="paint('inside')"
        stroke="currentColor"
        stroke-opacity=".3"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M78 78L82 105H173L177 78"
        stroke="currentColor"
        stroke-opacity=".18"
        stroke-linejoin="round"
      />
      <path
        d="M82 105H173L185 124H69Z"
        :class="ns.e('tone-surface')"
        fill="currentColor"
        fill-opacity=".75"
      />
      <path
        d="M55 127L82 105M201 127L173 105M82 105H173"
        stroke="currentColor"
        stroke-opacity=".13"
        stroke-linejoin="round"
      />
      <ellipse
        :class="[ns.e('interior-light'), ns.e('tone-surface')]"
        data-motion="light"
        cx="127"
        cy="115"
        rx="39"
        ry="7"
        fill="currentColor"
        fill-opacity=".5"
      />

      <g :class="ns.e('flap-left')" data-motion="flap-left">
        <path
          d="M78 78L49 63C46 61 43 63 41 67L28 100C27 103 28 106 31 108L55 127Z"
          :fill="paint('flap')"
          stroke="currentColor"
          stroke-opacity=".28"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="M46 68L34 100L54 116"
          stroke="currentColor"
          stroke-opacity=".13"
          stroke-linecap="round"
        />
      </g>
      <g :class="ns.e('flap-right')" data-motion="flap-right">
        <path
          d="M177 78L209 62C213 60 216 62 218 66L234 99C236 103 234 106 231 108L201 127Z"
          :fill="paint('flap')"
          stroke="currentColor"
          stroke-opacity=".28"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="M212 67L228 100L202 118"
          stroke="currentColor"
          stroke-opacity=".13"
          stroke-linecap="round"
        />
      </g>

      <path
        d="M55 127H92C97 127 99 130 101 135L104 141H153L157 135C159 130 161 127 166 127H201L197 163C196 170 192 173 185 173H71C63 173 59 170 58 163Z"
        :fill="paint('front')"
        stroke="currentColor"
        stroke-opacity=".34"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M61 131H89C93 131 95 133 97 138L101 145H156L160 138C162 133 165 131 169 131H195"
        :class="ns.e('tone-surface')"
        stroke="currentColor"
        stroke-opacity=".9"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M63 155L64 162C64 165 66 168 70 168H83"
        stroke="currentColor"
        stroke-opacity=".15"
        stroke-linecap="round"
      />
      <rect
        x="111"
        y="155"
        width="35"
        height="5"
        rx="2.5"
        fill="currentColor"
        fill-opacity=".16"
      />
      <circle cx="180" cy="158" r="2" fill="currentColor" fill-opacity=".2" />
    </g>
    <g :class="ns.e('spark')" data-motion="spark" fill="currentColor">
      <circle cx="55" cy="36" r="1.5" opacity=".5" />
      <circle cx="201" cy="31" r="2" opacity=".55" />
      <circle cx="227" cy="145" r="1.5" opacity=".4" />
    </g>
  </svg>
</template>
