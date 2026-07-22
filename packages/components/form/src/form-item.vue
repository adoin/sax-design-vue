<template>
  <div
    :class="[
      ns.b(),
      ns.is('error', !!error),
      ns.is('required', required || hasRequiredRule),
    ]"
  >
    <label v-if="label" :class="ns.e('label')" :style="labelStyle">{{
      label
    }}</label>
    <div :class="ns.e('content')" @focusout="validate">
      <slot />
      <div v-if="showMessage && error" :class="ns.e('error')">{{ error }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { formContextKey } from './constants'
import { formItemProps } from './form-item'
import type { FormRule } from './form'

defineOptions({ name: 'SFormItem' })

const props = defineProps(formItemProps)
const ns = useNamespace('form-item')
const form = inject(formContextKey)
const error = ref('')
const showMessage = computed(() => form?.showMessage.value ?? true)
const rules = computed<FormRule[]>(() => {
  const itemRules = props.rules
  if (itemRules) return Array.isArray(itemRules) ? itemRules : [itemRules]
  return props.prop
    ? (form?.getRules(props.prop) as FormRule[] | undefined) || []
    : []
})
const hasRequiredRule = computed(() =>
  rules.value.some((rule) => rule.required),
)
const labelStyle = computed(() => ({
  width: `${props.labelWidth ?? form?.labelWidth.value ?? 96}px`,
}))
const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && !value.length)

const validate = async () => {
  if (!props.prop) return true
  const value = form?.getValue(props.prop)
  for (const rule of rules.value) {
    if (rule.required && isEmpty(value)) {
      error.value = rule.message || `${props.label || props.prop} is required`
      form?.emitValidate(props.prop, false, error.value)
      return false
    }
    if (rule.validator && !isEmpty(value)) {
      const result = await rule.validator(
        value,
        form?.getValue('') as Record<string, unknown>,
      )
      if (result !== true) {
        error.value =
          typeof result === 'string'
            ? result
            : rule.message || `${props.label || props.prop} is invalid`
        form?.emitValidate(props.prop, false, error.value)
        return false
      }
    }
  }
  error.value = ''
  form?.emitValidate(props.prop, true, '')
  return true
}
const clearValidate = () => {
  error.value = ''
}
const resetField = () => clearValidate()

const field = { prop: props.prop, validate, clearValidate, resetField }
onMounted(() => form?.registerField(field))
onBeforeUnmount(() => form?.unregisterField(field))
defineExpose({ validate, clearValidate, resetField })
</script>
