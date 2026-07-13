<template>
  <div
    :class="[
      ns.b(),
      props.color && ns.m(props.color),
      { [ns.is('focus')]: isFocus, [ns.is('danger')]: isDanger },
    ]"
    :style="wrapperStyle"
  >
    <h4 v-if="label" :class="ns.e('label')">{{ label }}</h4>

    <textarea
      v-bind="$attrs"
      :value="modelValue"
      :class="ns.e('inner')"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />

    <div v-if="counter" :class="ns.e('count')">
      {{ (modelValue || '').length }} / {{ counter }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useColor, useNamespace } from '@vuesax-alpha/hooks'
import { getVsColor } from '@vuesax-alpha/utils'
import { textareaEmits, textareaProps } from './textarea'

defineOptions({
  name: 'VsTextarea',
  inheritAttrs: false,
})

const props = defineProps(textareaProps)
const emit = defineEmits(textareaEmits)

const ns = useNamespace('textarea')
const color = useColor('primary')

const isFocus = ref(false)

const isOverCounter = computed(
  () => props.counter && (props.modelValue?.length ?? 0) > Number(props.counter)
)

const isDanger = computed(() => props.counter && isOverCounter.value)

watch(isOverCounter, (val) => {
  emit('update:counterDanger', Boolean(val))
})

const wrapperStyle = computed(() => ({
  border: `1px solid ${
    isFocus.value ? getVsColor(props.color || color.value) : 'rgba(0, 0, 0,.08)'
  }`,
  height: props.height ?? undefined,
  width: props.width ?? undefined,
}))

const handleInput = (evt: Event) => {
  const target = evt.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', target.value)
}

const handleFocus = (evt: FocusEvent) => {
  isFocus.value = true
  emit('focus', evt)
}

const handleBlur = (evt: FocusEvent) => {
  isFocus.value = false
  emit('blur', evt)
}
</script>
