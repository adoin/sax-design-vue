<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { progressTextureAssets } from './progress-textures'
import ProgressSparkle from './progress-sparkle.vue'
import ProgressWaves from './progress-waves.vue'
import type { ProgressTexture } from './progress'

const props = defineProps<{
  texture: ProgressTexture
  animated: boolean
  duration: number
  opacity: number
  height: number
  playing: boolean
}>()
const ns = useNamespace('progress')
const asset = computed(() =>
  props.texture === 'bubbles'
    ? progressTextureAssets[props.texture]
    : undefined,
)
const styles = computed(() => ({
  backgroundImage: asset.value ? `url("${asset.value.image}")` : undefined,
  backgroundSize: asset.value
    ? `${(asset.value.width * props.height) / 32}px ${(asset.value.height * props.height) / 32}px`
    : undefined,
  '--sax-progress-tile-width': `${((asset.value?.width ?? 0) * props.height) / 32}px`,
  '--sax-progress-tile-height': `${((asset.value?.height ?? 0) * props.height) / 32}px`,
  '--sax-progress-texture-duration': `${Math.max(0, props.duration)}ms`,
  opacity: props.opacity,
}))
</script>

<template>
  <span
    v-if="asset || texture === 'sparkle' || texture === 'waves'"
    :class="[
      ns.e('texture'),
      ns.em('texture', texture),
      ns.is('animated', animated),
    ]"
    :style="styles"
    aria-hidden="true"
    ><ProgressSparkle
      v-if="texture === 'sparkle'"
      :duration="duration"
      :height="height" /><ProgressWaves
      v-else-if="texture === 'waves'"
      :height="height"
      :duration="duration"
      :animated="animated"
      :playing="playing"
  /></span>
</template>
