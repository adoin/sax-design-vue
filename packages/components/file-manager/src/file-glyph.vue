<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import type { FileManagerGraphic } from './types'
const props = defineProps<{
  kind:
    | 'back'
    | 'forward'
    | 'up'
    | 'home'
    | 'folder'
    | 'folder-open'
    | 'file'
    | 'eye'
    | 'eye-off'
    | 'grid'
    | 'list'
  graphic?: FileManagerGraphic
  extension?: string
}>()
const custom = computed(() =>
  typeof props.graphic === 'string' ? { icon: props.graphic } : props.graphic,
)
const failed = shallowRef(false)
watch(
  () => custom.value?.src,
  () => {
    failed.value = false
  },
)
const extensionLabel = computed(() => {
  const extension = props.extension ?? ''
  return props.kind === 'file' && Array.from(extension).length <= 2
    ? extension
    : ''
})
const paths: Record<string, string> = {
  back: 'm15 5-7 7 7 7',
  forward: 'm9 5 7 7-7 7',
  up: 'M3 7V4h6l3 3h9v13H3ZM12 17v-7m-3 3 3-3 3 3',
  home: 'M3 11 12 3l9 8v10h-6v-7H9v7H3Z',
  file: 'M6 3h8l5 5v13H6ZM14 3v6h5',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z',
  'eye-off':
    'm3 3 18 18M10 5.2A13 13 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.1M6.3 6.3A22 22 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5-1.1M10 10a3 3 0 0 0 4 4',
  grid: 'M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z',
  list: 'M4 5h16M4 12h16M4 19h16',
}
</script>
<template>
  <span class="s-file-manager__glyph" :class="`is-${kind}`" aria-hidden="true">
    <img
      v-if="custom?.src && !failed"
      :src="custom.src"
      alt=""
      loading="lazy"
      draggable="false"
      @error="failed = true"
    />
    <SIcon v-else-if="custom?.icon" :name="custom.icon" />
    <svg
      v-else-if="kind === 'folder' || kind === 'folder-open'"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M2 6a2 2 0 0 1 2-2h6l3 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"
        opacity=".6"
      />
      <path
        v-if="kind === 'folder-open'"
        d="M4 10h18a1 1 0 0 1 1 1.3l-3 8.4a2 2 0 0 1-1.9 1.3H3a1 1 0 0 1-1-1.3Z"
      />
      <path v-else d="M2 9h20v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" />
    </svg>
    <svg
      v-else
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path :d="paths[kind]" />
      <text
        v-if="extensionLabel"
        x="12.5"
        y="15.5"
        text-anchor="middle"
        fill="currentColor"
        stroke="none"
        style="font: 600 4.5px sans-serif"
      >
        {{ extensionLabel }}
      </text>
    </svg>
  </span>
</template>
