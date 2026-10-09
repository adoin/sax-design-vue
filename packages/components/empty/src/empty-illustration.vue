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
        :id="`${id}-paper`"
        x1="75"
        y1="38"
        x2="130"
        y2="117"
        gradientUnits="userSpaceOnUse"
      >
        <stop :class="ns.e('tone-surface')" stop-color="currentColor" />
        <stop offset="1" :class="ns.e('tone-tint')" stop-color="currentColor" />
      </linearGradient>
      <linearGradient
        :id="`${id}-inside`"
        x1="128"
        y1="94"
        x2="128"
        y2="147"
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
      <linearGradient
        :id="`${id}-glass`"
        x1="155"
        y1="88"
        x2="196"
        y2="131"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          :class="ns.e('tone-surface')"
          stop-color="currentColor"
          stop-opacity=".9"
        />
        <stop
          offset="1"
          :class="ns.e('tone-accent')"
          stop-color="currentColor"
          stop-opacity=".13"
        />
      </linearGradient>
      <clipPath :id="`${id}-lens`">
        <circle cx="176" cy="109" r="22" />
      </clipPath>
    </defs>

    <ellipse cx="128" cy="103" rx="114" ry="88" :fill="paint('halo')" />
    <g :class="ns.e('orbit')" stroke="currentColor" stroke-linecap="round">
      <path
        d="M39 116C24 77 53 38 94 30M150 28C184 30 217 57 223 85"
        stroke-dasharray="2 7"
      />
      <path d="M34 148H44M214 166H228M42 58H48M45 55V61" opacity=".6" />
      <circle cx="204" cy="49" r="3" />
      <circle cx="28" cy="100" r="2" />
    </g>
    <ellipse
      :class="ns.e('ground')"
      cx="130"
      cy="179"
      rx="85"
      ry="8"
      fill="currentColor"
    />

    <g :class="ns.e('ticket')" data-motion="ticket">
      <path
        d="M85 39H124L140 55V115C140 120 136 124 131 124H85C80 124 76 120 76 115V48C76 43 80 39 85 39Z"
        :fill="paint('paper')"
      />
      <path
        d="M85 39H124L140 55V115C140 120 136 124 131 124H85C80 124 76 120 76 115V48C76 43 80 39 85 39Z"
        stroke="currentColor"
        stroke-opacity=".28"
        stroke-width="1.5"
      />
      <path
        d="M124 39V51C124 54 126 56 129 56H140"
        stroke="currentColor"
        stroke-opacity=".3"
        stroke-width="1.5"
      />
      <rect
        x="87"
        y="63"
        width="42"
        height="40"
        rx="5"
        stroke="currentColor"
        stroke-opacity=".28"
        stroke-dasharray="3 4"
      />
      <path
        d="M103 83H113M108 78V88"
        stroke="currentColor"
        stroke-opacity=".38"
        stroke-width="1.8"
        stroke-linecap="round"
      />
      <path
        d="M91 112H108M113 112H125"
        stroke="currentColor"
        stroke-opacity=".18"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>

    <g :class="ns.e('tray')">
      <path
        d="M74 90H179C184 90 187 93 189 99L204 139H55L65 101C67 94 69 90 74 90Z"
        :fill="paint('inside')"
        stroke="currentColor"
        stroke-opacity=".3"
        stroke-width="1.5"
      />
      <path
        d="M76 101H177L188 132H66L76 101Z"
        :class="ns.e('tone-surface')"
        fill="currentColor"
        fill-opacity=".55"
      />
      <path
        d="M76 101H177M66 132H188"
        stroke="currentColor"
        stroke-opacity=".15"
        stroke-linecap="round"
      />
      <path
        d="M82 119H99M155 119H173"
        stroke="currentColor"
        stroke-opacity=".13"
        stroke-width="1.5"
        stroke-dasharray="3 4"
      />
      <g :class="ns.e('flap-left')" data-motion="flap">
        <path
          d="M66 99L47 115C44 118 45 121 49 123L64 131L88 106L66 99Z"
          :fill="paint('paper')"
          stroke="currentColor"
          stroke-opacity=".25"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="M50 118L65 124L81 108"
          stroke="currentColor"
          stroke-opacity=".13"
          stroke-linecap="round"
        />
      </g>
      <path
        d="M187 99L211 116C215 119 213 122 209 124L196 132L166 106L187 99Z"
        :fill="paint('paper')"
        stroke="currentColor"
        stroke-opacity=".25"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M55 139H92C97 139 99 143 101 148L104 153H153L157 146C159 141 161 139 166 139H204L201 165C200 172 196 176 189 176H71C63 176 59 172 58 165L55 139Z"
        :fill="paint('front')"
        stroke="currentColor"
        stroke-opacity=".32"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M61 143H89C93 143 95 145 97 150L101 157H156L160 150C162 145 165 143 169 143H198"
        :class="ns.e('tone-surface')"
        stroke="currentColor"
        stroke-opacity=".85"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M63 158L64 165C64 168 66 170 70 170H83"
        stroke="currentColor"
        stroke-opacity=".15"
        stroke-linecap="round"
      />
      <rect
        x="111"
        y="162"
        width="35"
        height="5"
        rx="2.5"
        fill="currentColor"
        fill-opacity=".15"
      />
      <circle cx="180" cy="163" r="2" fill="currentColor" fill-opacity=".2" />
    </g>

    <g :class="ns.e('search')" data-motion="search">
      <path
        d="M192 126L213 150C215 152 219 152 221 150C223 148 223 145 221 143L198 121"
        :class="ns.e('tone-accent')"
        fill="currentColor"
        fill-opacity=".8"
      />
      <path
        d="M201 133L216 149"
        :class="ns.e('tone-surface')"
        stroke="currentColor"
        stroke-opacity=".4"
        stroke-width="2"
        stroke-linecap="round"
      />
      <circle
        cx="176"
        cy="109"
        r="27"
        :class="ns.e('tone-surface')"
        fill="currentColor"
      />
      <circle
        cx="176"
        cy="109"
        r="26"
        stroke="currentColor"
        stroke-width="3"
        stroke-opacity=".65"
      />
      <circle cx="176" cy="109" r="22" :fill="paint('glass')" />
      <g :clip-path="paint('lens')">
        <path
          d="M151 117L186 82H196L158 124Z"
          :class="ns.e('tone-surface')"
          fill="currentColor"
          fill-opacity=".65"
        />
        <path
          d="M170 105H182M176 99V111"
          stroke="currentColor"
          stroke-opacity=".25"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <circle
          :class="ns.e('scan')"
          data-motion="scan"
          cx="176"
          cy="109"
          r="15"
          stroke="currentColor"
          stroke-opacity=".3"
          stroke-dasharray="2 5"
        />
      </g>
      <path
        d="M158 104C160 94 166 90 175 89"
        :class="ns.e('tone-surface')"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </g>
    <g
      :class="ns.e('spark')"
      data-motion="spark"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="1.5"
    >
      <path d="M163 47V57M158 52H168" />
      <path d="M53 83V89M50 86H56" opacity=".5" />
      <circle
        cx="224"
        cy="126"
        r="2"
        fill="currentColor"
        stroke="none"
        opacity=".55"
      />
    </g>
  </svg>
</template>
