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
      ref="textareaRef"
      v-bind="$attrs"
      :value="modelValue"
      :class="ns.e('inner')"
      :readonly="readonly || !editable"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      :form="form"
      :maxlength="resolvedMaxLength"
      :rows="rows"
      :cols="cols"
      :style="textareaStyle"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="(event) => emit('keydown', event)"
      @keyup="(event) => emit('keyup', event)"
      @click="(event) => emit('click', event)"
    />

    <div v-if="showCount" :class="ns.e('count')">
      {{ wordCount }}<template v-if="countLimit"> / {{ countLimit }}</template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useColor, useNamespace } from '@vuesax-alpha/hooks'
import { getVsColor } from '@vuesax-alpha/utils'
import { textareaEmits, textareaProps } from './textarea'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'STextarea',
  inheritAttrs: false,
})

const props = defineProps(textareaProps)
const emit = defineEmits(textareaEmits)

const ns = useNamespace('textarea')
const color = useColor('primary')

const isFocus = ref(false)
const textareaRef = ref<HTMLTextAreaElement>()
const pendingValue = ref(props.modelValue || '')

const countLimit = computed(() => props.counter ?? resolvedMaxLength.value)
const showCount = computed(() => Boolean(props.counter || props.showWordCount))
const resolvedMaxLength = computed(() => props.maxLength ?? props.maxlength)
const autoSizeConfig = computed(() => props.autoSize ?? props.autosize)
const wordCount = computed(() => {
  const value = props.modelValue || ''
  return props.countMethod ? props.countMethod({ value }) : value.length
})

const isOverCounter = computed(() => {
  if (!props.counter) return false
  const limit = Number(countLimit.value)
  return wordCount.value > limit
})

const isDanger = computed(() => Boolean(props.counter && isOverCounter.value))

watch(isOverCounter, (val) => {
  emit('update:counterDanger', Boolean(val))
})

const resolveBorderColor = (colorValue: string) => {
  const resolved = getVsColor(colorValue)
  if (!resolved) return 'rgba(0, 0, 0, 0.08)'
  return resolved.startsWith('var(') ? resolved : `rgb(${resolved})`
}

const wrapperStyle = computed(() => ({
  border: `1px solid ${
    isFocus.value
      ? resolveBorderColor(props.color || color.value || 'primary')
      : 'rgba(0, 0, 0, 0.08)'
  }`,
  height: autoSizeConfig.value ? undefined : (props.height ?? undefined),
  width: props.width ?? undefined,
}))

const textareaStyle = computed<CSSProperties>(() => ({
  resize: props.resize as CSSProperties['resize'],
}))

const resizeTextarea = () => {
  const textarea = textareaRef.value
  const config = autoSizeConfig.value
  if (!textarea || !config) return

  textarea.style.height = 'auto'
  const style = window.getComputedStyle(textarea)
  const lineHeight = Number.parseFloat(style.lineHeight) || 19
  const minHeight = Math.max(1, config.minRows ?? 1) * lineHeight
  const maxHeight = config.maxRows
    ? config.maxRows * lineHeight
    : Number.POSITIVE_INFINITY
  textarea.style.height = `${Math.min(
    Math.max(textarea.scrollHeight, minHeight),
    maxHeight,
  )}px`
  textarea.style.overflowY =
    textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
}

watch(
  () => [props.modelValue, autoSizeConfig.value],
  () => nextTick(resizeTextarea),
  { deep: true },
)

onMounted(() => resizeTextarea())

const handleInput = (evt: Event) => {
  const target = evt.target as HTMLTextAreaElement
  pendingValue.value = target.value
  if (props.immediate) emit('update:modelValue', target.value)
  emit('input', target.value)
  resizeTextarea()
}

const handleChange = (evt: Event) => {
  const target = evt.target as HTMLTextAreaElement
  const value = props.trim ? target.value.trim() : target.value
  if (value !== target.value) target.value = value
  pendingValue.value = value
  if (!props.immediate) emit('update:modelValue', value)
  emit('change', value)
  emit('lazy-change', value)
}

const handleFocus = (evt: FocusEvent) => {
  isFocus.value = true
  emit('focus', evt)
}

const handleBlur = (evt: FocusEvent) => {
  isFocus.value = false
  if (props.trim && pendingValue.value !== pendingValue.value.trim()) {
    pendingValue.value = pendingValue.value.trim()
    emit('update:modelValue', pendingValue.value)
  }
  emit('blur', evt)
}

const focus = () => textareaRef.value?.focus()
const blur = () => textareaRef.value?.blur()

defineExpose({ focus, blur })
</script>
