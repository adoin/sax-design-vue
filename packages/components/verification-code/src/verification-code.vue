<script lang="ts" setup>
import { computed, shallowRef, useTemplateRef, watch } from 'vue'
import { useNamespace, useShape } from '@vuesax-alpha/hooks'
import {
  verificationCodeEmits,
  verificationCodeProps,
} from './verification-code'

defineOptions({ name: 'SVerificationCode', inheritAttrs: false })

const props = defineProps(verificationCodeProps)
const emit = defineEmits(verificationCodeEmits)
const ns = useNamespace('verification-code')
const shape = useShape()
const inputRef = useTemplateRef<HTMLInputElement>('input')
const focused = shallowRef(false)
const safeLength = computed(() => Math.max(1, Math.floor(props.length)))
const pattern = computed(() =>
  props.mode === 'numeric' ? /\D/g : /[^a-z0-9]/gi,
)
const sanitize = (value: string) =>
  value.replace(pattern.value, '').slice(0, safeLength.value)
const normalizedValue = computed(() => sanitize(props.modelValue))
const cells = computed(() =>
  Array.from({ length: safeLength.value }, (_, index) => {
    const character = normalizedValue.value[index] || ''
    const masked = props.mask
      ? character
        ? typeof props.mask === 'string'
          ? props.mask
          : '•'
        : ''
      : character
    return {
      index,
      character,
      display: masked,
      filled: Boolean(character),
      active:
        focused.value &&
        index === Math.min(normalizedValue.value.length, safeLength.value - 1),
    }
  }),
)
const classes = computed(() => [
  ns.b(),
  ns.is(props.variant),
  ns.is(shape.value),
  ns.is(props.status, props.status !== 'default'),
  ns.is('focused', focused.value),
  ns.is('complete', normalizedValue.value.length === safeLength.value),
  ns.is('disabled', props.disabled),
])

const update = (value: string) => {
  const next = sanitize(value)
  emit('update:modelValue', next)
  emit('input', next)
  if (
    next.length === safeLength.value &&
    normalizedValue.value.length !== safeLength.value
  ) {
    emit('complete', next)
  }
}
const handleInput = (event: Event) =>
  update((event.target as HTMLInputElement).value)
const handleChange = (event: Event) =>
  emit('change', sanitize((event.target as HTMLInputElement).value))
const handleFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}
const handleBlur = (event: FocusEvent) => {
  focused.value = false
  emit('blur', event)
}
const focus = () => inputRef.value?.focus()
const blur = () => inputRef.value?.blur()
const clear = () => {
  update('')
  emit('change', '')
  focus()
}

watch(
  () => [props.modelValue, props.length, props.mode] as const,
  () => {
    if (normalizedValue.value !== props.modelValue)
      emit('update:modelValue', normalizedValue.value)
  },
  { immediate: true },
)

defineExpose({ focus, blur, clear, input: inputRef })
</script>

<template>
  <div :class="classes" @click="focus">
    <input
      v-bind="$attrs"
      ref="input"
      :class="ns.e('input')"
      :value="normalizedValue"
      :maxlength="safeLength"
      :inputmode="mode === 'numeric' ? 'numeric' : 'text'"
      :pattern="mode === 'numeric' ? '[0-9]*' : '[A-Za-z0-9]*'"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="status === 'error' || undefined"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span :class="ns.e('visual')" aria-hidden="true">
      <span
        v-for="cell in cells"
        :key="cell.index"
        :class="[
          ns.e('cell'),
          ns.is('filled', cell.filled),
          ns.is('active', cell.active),
        ]"
      >
        {{ cell.display }}
      </span>
    </span>
  </div>
</template>
