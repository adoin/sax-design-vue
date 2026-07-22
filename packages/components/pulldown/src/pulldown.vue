<template>
  <s-popper
    v-model:visible="visible"
    :trigger="trigger"
    :placement="placement"
    :offset="offset"
    :disabled="disabled"
    :teleported="teleported"
    :fit="fit"
    :show-arrow="false"
    :popper-class="ns.e('popper')"
    @show="emit('show')"
    @hide="emit('hide')"
  >
    <slot />
    <template #content
      ><div :class="ns.b()"><slot name="dropdown" :hide="hide" /></div
    ></template>
  </s-popper>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import SPopper from '@vuesax-alpha/components/popper'
import { useNamespace } from '@vuesax-alpha/hooks'
import { pulldownEmits, pulldownProps } from './pulldown'

defineOptions({ name: 'SPulldown' })

const props = defineProps(pulldownProps)
const emit = defineEmits(pulldownEmits)
const ns = useNamespace('pulldown')
const visible = ref(props.modelValue)
const hide = () => {
  visible.value = false
}

watch(
  () => props.modelValue,
  (value) => {
    visible.value = value
  },
)
watch(visible, (value) => emit('update:modelValue', value))

defineExpose({ hide })
</script>
