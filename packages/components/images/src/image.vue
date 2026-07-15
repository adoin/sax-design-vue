<template>
  <li :class="ns.e('item')">
    <div :class="ns.e('wrap')">
      <div :class="ns.e('img')" :style="styleImage" />
    </div>
    <img :src="src" :class="ns.e('blur')" alt="" />
  </li>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { imageProps } from './image'

defineOptions({
  name: 'SImage',
  inheritAttrs: false,
})

const props = defineProps(imageProps)

const ns = useNamespace('images')

const styleImage = computed(() => ({
  backgroundImage: props.src ? `url(${props.src})` : undefined,
}))
</script>
