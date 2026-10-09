<script setup lang="ts">
import { useNamespace } from '@vuesax-alpha/hooks'
import LogoLoading from './logo-loading.vue'
withDefaults(defineProps<{ active?: boolean; shape?: string }>(), {
  active: true,
})
const emit = defineEmits<{ restored: [] }>()
defineOptions({ name: 'IconControlLoading' })
const ns = useNamespace('control-loading')
</script>
<template>
  <span :class="ns.b()" aria-hidden="true">
    <LogoLoading
      :size="20"
      :active="active"
      :shape="
        shape === 'square'
          ? 'square'
          : shape === 'rounded'
            ? 'rounded'
            : undefined
      "
      stop-behavior="corners"
      @restored="emit('restored')"
    />
  </span>
</template>
