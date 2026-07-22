<template>
  <form :class="[ns.b(), ns.is('inline', inline)]" @submit.prevent="submit">
    <slot />
  </form>
</template>

<script lang="ts" setup>
import { provide, toRef } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { formContextKey } from './constants'
import { formEmits, formProps } from './form'
import type { FormFieldContext } from './constants'

defineOptions({ name: 'SForm' })

const props = defineProps(formProps)
const emit = defineEmits(formEmits)
const ns = useNamespace('form')
const fields = new Set<FormFieldContext>()
const initialValues = new Map<string, unknown>()

const getSegments = (prop: string) => prop.split('.').filter(Boolean)
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
    initialValues.set(field.prop, getValue(field.prop))
}
const unregisterField = (field: FormFieldContext) => fields.delete(field)

provide(formContextKey, {
  labelWidth: toRef(props, 'labelWidth'),
  disabled: toRef(props, 'disabled'),
  showMessage: toRef(props, 'showMessage'),
  getRules,
  getValue,
  setValue,
  registerField,
  unregisterField,
  emitValidate: (prop, valid, message) =>
    emit('validate', prop, valid, message),
})

const validate = async () => {
  const results = await Promise.all(
    [...fields].map((field) => field.validate()),
  )
  return results.every(Boolean)
}
const validateField = async (prop: string) => {
  const field = [...fields].find((item) => item.prop === prop)
  return field ? field.validate() : true
}
const clearValidate = (props?: string | string[]) => {
  const selected = props ? (Array.isArray(props) ? props : [props]) : undefined
  ;[...fields].forEach((field) => {
    if (!selected || (field.prop && selected.includes(field.prop)))
      field.clearValidate()
  })
}
const resetFields = () => {
  initialValues.forEach((value, prop) => setValue(prop, value))
  ;[...fields].forEach((field) => field.resetField())
}
const submit = async () => {
  await validate()
}

defineExpose({ validate, validateField, clearValidate, resetFields })
</script>
