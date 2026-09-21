<script setup lang="ts">
import { useNamespace } from '@vuesax-alpha/hooks'

defineOptions({ name: 'STableFindActionMark' })

defineProps<{
  kind: 'replace' | 'replace-all'
}>()

const ns = useNamespace('table')
</script>

<template>
  <svg
    v-if="kind === 'replace'"
    :class="ns.e('find-action-mark')"
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      :class="ns.e('find-action-page')"
      x="23"
      y="16"
      width="70"
      height="92"
      rx="10"
      stroke-width="8"
    />
    <path
      :class="ns.e('find-action-line')"
      d="M39 36H76"
      stroke-width="7"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-line')"
      d="M39 51H76"
      stroke-width="7"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-match')"
      d="M39 67H65"
      stroke-width="8"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-line')"
      d="M39 82H65"
      stroke-width="7"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-line')"
      d="M39 96H57"
      stroke-width="7"
      stroke-linecap="round"
    />
    <circle
      :class="ns.e('find-action-badge')"
      cx="91"
      cy="89"
      r="28"
      stroke-width="4"
    />
    <path
      :class="ns.e('find-action-glyph')"
      d="M75 89H103"
      stroke-width="8"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-glyph')"
      d="M94 78L105 89L94 100"
      stroke-width="8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
  <svg
    v-else
    :class="ns.e('find-action-mark')"
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      :class="ns.e('find-action-page')"
      x="42"
      y="12"
      width="66"
      height="82"
      rx="9"
      stroke-width="7"
    />
    <rect
      :class="ns.e('find-action-page')"
      x="32"
      y="23"
      width="66"
      height="82"
      rx="9"
      stroke-width="7"
    />
    <rect
      :class="ns.e('find-action-page')"
      x="22"
      y="35"
      width="66"
      height="80"
      rx="9"
      stroke-width="7"
    />
    <path
      :class="ns.e('find-action-line')"
      d="M37 53H70"
      stroke-width="6.5"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-line')"
      d="M37 67H70"
      stroke-width="6.5"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-match')"
      d="M37 81H58"
      stroke-width="7.5"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-line')"
      d="M37 95H62"
      stroke-width="6.5"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-line')"
      d="M37 107H55"
      stroke-width="6.5"
      stroke-linecap="round"
    />
    <circle
      :class="ns.e('find-action-badge')"
      cx="94"
      cy="91"
      r="29"
      stroke-width="4"
    />
    <path
      :class="ns.e('find-action-glyph')"
      d="M77 88C78.5 79 85.5 73 94 73C101 73 106 76.5 109 82"
      stroke-width="7"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-glyph')"
      d="M103 79L110 83L111 74"
      stroke-width="6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      :class="ns.e('find-action-glyph')"
      d="M111 94C109.5 103 102.5 109 94 109C87 109 82 105.5 79 100"
      stroke-width="7"
      stroke-linecap="round"
    />
    <path
      :class="ns.e('find-action-glyph')"
      d="M85 103L78 99L77 108"
      stroke-width="6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
