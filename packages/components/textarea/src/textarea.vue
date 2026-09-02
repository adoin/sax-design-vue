<template>
  <div
    :class="[
      ns.b(),
      props.color && ns.m(props.color),
      ns.is(shape),
      {
        [ns.is('focus')]: isFocus,
        [ns.is('danger')]: isDanger,
        [ns.is('label-active')]: isLabelActive,
      },
    ]"
    :style="wrapperStyle"
  >
    <label v-if="label" :class="ns.e('label')" :for="textareaId">
      {{ label }}
    </label>

    <textarea
      :id="textareaId"
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
import {
  computed,
  nextTick,
  onMounted,
  shallowRef,
  useAttrs,
  useTemplateRef,
  watch,
} from 'vue'
import { useColor, useId, useNamespace, useShape } from '@vuesax-alpha/hooks'
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
const shape = useShape()
const color = useColor('primary')
const attrs = useAttrs()
const generatedId = useId()

const isFocus = shallowRef(false)
const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef')
const pendingValue = shallowRef(props.modelValue || '')
const textareaId = computed(() => String(attrs.id || generatedId.value))

const countLimit = computed(() => props.counter ?? resolvedMaxLength.value)
const showCount = computed(() => Boolean(props.counter || props.showWordCount))
const resolvedMaxLength = computed(() => props.maxLength ?? props.maxlength)
const autoSizeConfig = computed(() => props.autoSize ?? props.autosize)
const isLabelActive = computed(
  () =>
    Boolean(props.label) &&
    (isFocus.value ||
      Boolean(pendingValue.value) ||
      Boolean(props.placeholder)),
)
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

const resolveFocusColor = (colorValue: string) => {
  const resolved = getVsColor(colorValue)
  return resolved ? `hsl(${resolved})` : 'hsl(var(--sax-primary))'
}

const wrapperStyle = computed(() => ({
  '--sax-textarea-focus-color': resolveFocusColor(
    props.color || color.value || 'primary',
  ),
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

watch(
  () => props.modelValue,
  (value) => {
    pendingValue.value = value || ''
  },
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
