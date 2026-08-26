<script lang="ts" setup>
import { computed, nextTick, provide, toRef } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import FormConfigItem from './form-config-item.vue'
import { formContextKey } from './constants'
import { formEmits, formProps } from './form'
import type { CSSProperties } from 'vue'
import type { FormFieldContext } from './constants'
import type { FormItemConfig, FormRuleTrigger } from './form'

defineOptions({ name: 'SForm' })

const props = defineProps(formProps)
const emit = defineEmits(formEmits)
const ns = useNamespace('form')
const fields = new Set<FormFieldContext>()
const initialValues = new Map<string, unknown>()

const toCssUnit = (value: string | number) =>
  typeof value === 'number' ? `${value}px` : value

const formStyle = computed<CSSProperties>(() => ({
  '--sax-form-column-gap': toCssUnit(props.columnGap),
  '--sax-form-row-gap': toCssUnit(props.rowGap),
}))

const getSegments = (prop: string) => prop.split('.').filter(Boolean)
const cloneInitialValue = (value: unknown): unknown => {
  if (value instanceof Date) return new Date(value)
  if (Array.isArray(value)) return value.map(cloneInitialValue)
  if (value && typeof value === 'object')
    return Object.keys(value).reduce<Record<string, unknown>>((copy, key) => {
      copy[key] = cloneInitialValue((value as Record<string, unknown>)[key])
      return copy
    }, {})
  return value
}

const getValue = (prop: string) =>
  getSegments(prop).reduce<unknown>(
    (value, key) =>
      value && typeof value === 'object'
        ? (value as Record<string, unknown>)[key]
        : undefined,
    props.model,
  )

const setValue = (prop: string, value: unknown) => {
  const segments = getSegments(prop)
  const last = segments.pop()
  if (!last) return
  const target = segments.reduce<Record<string, unknown>>((current, key) => {
    if (!current[key] || typeof current[key] !== 'object') current[key] = {}
    return current[key] as Record<string, unknown>
  }, props.model)
  target[last] = value
}

const getRules = (prop: string) => {
  const rules = props.rules[prop]
  return rules ? (Array.isArray(rules) ? rules : [rules]) : []
}

const registerField = (field: FormFieldContext) => {
  fields.add(field)
  if (field.prop && !initialValues.has(field.prop))
    initialValues.set(field.prop, cloneInitialValue(getValue(field.prop)))
}

const unregisterField = (field: FormFieldContext) => fields.delete(field)

const validateField = async (
  prop: string,
  trigger?: FormRuleTrigger | 'submit',
) => {
  const field = [...fields].find((item) => item.prop === prop)
  return field ? field.validate(trigger) : true
}

const getErrors = () =>
  [...fields].reduce<Record<string, string>>((errors, field) => {
    if (field.prop && field.error.value) errors[field.prop] = field.error.value
    return errors
  }, {})

const validate = async () => {
  const fieldList = [...fields]
  const results = await Promise.all(
    fieldList.map((field) => field.validate('submit')),
  )
  const firstInvalidIndex = results.findIndex((valid) => !valid)

  if (firstInvalidIndex >= 0 && props.scrollToError) {
    await nextTick()
    fieldList[firstInvalidIndex]?.focus()
  }
  return firstInvalidIndex < 0
}

const clearValidate = (selectedProps?: string | string[]) => {
  const selected = selectedProps
    ? Array.isArray(selectedProps)
      ? selectedProps
      : [selectedProps]
    : undefined
  ;[...fields].forEach((field) => {
    if (!selected || (field.prop && selected.includes(field.prop)))
      field.clearValidate()
  })
}

const resetFields = (event?: Event) => {
  initialValues.forEach((value, prop) =>
    setValue(prop, cloneInitialValue(value)),
  )
  ;[...fields].forEach((field) => field.resetField())
  if (event) emit('reset', props.model, event)
}

const submit = async (event?: Event) => {
  const valid = await validate()
  if (valid) emit('submit', props.model, event)
  else emit('invalidSubmit', getErrors(), props.model, event)
  return valid
}

const getItemKey = (item: FormItemConfig, index: number) =>
  item.key ?? item.prop ?? item.field ?? index

provide(formContextKey, {
  model: toRef(props, 'model'),
  labelWidth: toRef(props, 'labelWidth'),
  labelPosition: toRef(props, 'labelPosition'),
  labelAlign: toRef(props, 'labelAlign'),
  disabled: toRef(props, 'disabled'),
  readonly: toRef(props, 'readonly'),
  showMessage: toRef(props, 'showMessage'),
  reserveErrorSpace: toRef(props, 'reserveErrorSpace'),
  getRules,
  getValue,
  setValue,
  registerField,
  unregisterField,
  validateField,
  emitValidate: (prop, valid, message) =>
    emit('validate', prop, valid, message),
})

defineExpose({
  validate,
  validateField,
  clearValidate,
  resetFields,
  submit,
  getErrors,
})
</script>

<template>
  <form
    :class="[
      ns.b(),
      ns.is('inline', inline),
      ns.is(`label-${labelPosition}`),
      ns.is(`label-align-${labelAlign}`),
    ]"
    :style="formStyle"
    novalidate
    @submit.prevent="submit"
    @reset.prevent="resetFields"
  >
    <div :class="ns.e('grid')">
      <FormConfigItem
        v-for="(item, index) in items"
        :key="getItemKey(item, index)"
        :item="item"
      >
        <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps || {}" />
        </template>
      </FormConfigItem>
      <slot />
    </div>
  </form>
</template>
