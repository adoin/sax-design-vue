<template>
  <div :class="ns.b()" role="status">
    <div :class="ns.e('image')" :style="imageStyle">
      <slot name="image">
        <img v-if="image" :src="image" alt="" />
        <span v-else :class="ns.e('illustration')" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </slot>
    </div>
    <p v-if="description || $slots.description" :class="ns.e('description')">
      <slot name="description">{{ description }}</slot>
    </p>
    <div v-if="$slots.default" :class="ns.e('bottom')">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { addUnit } from '@vuesax-alpha/utils'
import { useNamespace } from '@vuesax-alpha/hooks'
import { emptyProps } from './empty'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SEmpty' })

const props = defineProps(emptyProps)
const ns = useNamespace('empty')

const imageStyle = computed<CSSProperties>(() => {
  if (!props.imageSize) return {}
  const size = addUnit(props.imageSize)
  return { width: size, height: size }
})
</script>
