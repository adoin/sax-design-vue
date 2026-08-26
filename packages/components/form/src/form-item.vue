<script lang="ts" setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  readonly,
  shallowRef,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue'
import { useId, useNamespace } from '@vuesax-alpha/hooks'
import FormRenderer from './form-renderer'
import { formContextKey } from './constants'
import { FORM_DEFAULT_LABEL_WIDTH } from './form'
import { formItemProps } from './form-item'
import { formRuleMatchesTrigger, validateFormValue } from './form-validator'
import type { CSSProperties } from 'vue'
import type {
  FormItemConfig,
  FormItemSpan,
  FormRule,
  FormRuleTrigger,
} from './form'

defineOptions({ name: 'SFormItem' })

const props = defineProps(formItemProps)
const slots = useSlots()
const ns = useNamespace('form-item')
const form = inject(formContextKey)
const rootRef = useTemplateRef<HTMLElement>('root')
const controlId = useId(computed(() => props.id || ''))
const error = shallowRef('')
let validationSequence = 0

const fieldProp = computed(() => props.prop ?? props.field)
const fieldValue = computed(() =>
  fieldProp.value ? form?.getValue(fieldProp.value) : undefined,
)
const labelText = computed(() => props.label ?? props.title ?? '')
const showMessage = computed(() => form?.showMessage.value ?? true)
const labelPosition = computed(() =>
  props.vertical
    ? 'top'
    : (props.labelPosition ?? form?.labelPosition.value ?? 'right'),
)
const reserveErrorSpace = computed(
  () => props.reserveErrorSpace ?? form?.reserveErrorSpace.value ?? true,
)
const rules = computed<FormRule[]>(() => {
  const itemRules = props.rules
  if (itemRules) return Array.isArray(itemRules) ? itemRules : [itemRules]
  return fieldProp.value
    ? (form?.getRules(fieldProp.value) as FormRule[] | undefined) || []
    : []
})
const hasRequiredRule = computed(() =>
  rules.value.some((rule) => rule.required),
)
const hasLabel = computed(() => !!labelText.value || !!slots.label)
const hasMessageArea = computed(
  () =>
    showMessage.value &&
    !!fieldProp.value &&
    (reserveErrorSpace.value || !!error.value || !!props.description),
)

const toCssUnit = (value: string | number) =>
  typeof value === 'number' ? `${value}px` : value

const labelStyle = computed<CSSProperties>(() => {
  if (labelPosition.value === 'top') return {}
  return {
    width: toCssUnit(
      props.labelWidth ?? form?.labelWidth.value ?? FORM_DEFAULT_LABEL_WIDTH,
    ),
  }
})

const clampSpan = (value: number | undefined, fallback: number) =>
  value == null ? fallback : Math.min(24, Math.max(1, value))

const normalizeSpan = (span: FormItemSpan) => {
  if (typeof span === 'number') {
    const desktop = clampSpan(span, 24)
    return { xs: 24, sm: 24, md: desktop, lg: desktop, xl: desktop }
  }
  const xs = clampSpan(span.xs, 24)
  const sm = clampSpan(span.sm, xs)
  const md = clampSpan(span.md, sm)
  const lg = clampSpan(span.lg, md)
  return { xs, sm, md, lg, xl: clampSpan(span.xl, lg) }
}

const spanStyle = computed<CSSProperties>(() => {
  const span = normalizeSpan(props.span)
  return {
    '--sax-form-item-span-xs': span.xs,
    '--sax-form-item-span-sm': span.sm,
    '--sax-form-item-span-md': span.md,
    '--sax-form-item-span-lg': span.lg,
    '--sax-form-item-span-xl': span.xl,
  } as CSSProperties
})

const validate = (trigger?: FormRuleTrigger | 'submit') => {
  const prop = fieldProp.value
  if (!prop) return Promise.resolve(true)
  if (!rules.value.some((rule) => formRuleMatchesTrigger(rule, trigger)))
    return Promise.resolve(true)
  const sequence = ++validationSequence
  const validation = validateFormValue({
    field: prop,
    label: labelText.value,
    value: form?.getValue(prop),
    model: form?.model.value || {},
    rules: rules.value,
    trigger,
  })
  const applyResult = (result: Awaited<typeof validation>) => {
    if (sequence !== validationSequence) return false
    error.value = result.message
    form?.emitValidate(prop, result.valid, result.message)
    return result.valid
  }
  return validation instanceof Promise
    ? validation.then(applyResult)
    : Promise.resolve(applyResult(validation))
}

const clearValidate = () => {
  validationSequence++
  error.value = ''
}
const resetField = () => clearValidate()
const focus = () => {
  const target = rootRef.value?.querySelector<HTMLElement>(
    'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )
  target?.focus()
  rootRef.value?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' })
}

const handleFocusOut = (event: FocusEvent) => {
  if (
    event.relatedTarget instanceof Node &&
    rootRef.value?.contains(event.relatedTarget)
  )
    return
  validate('blur')
}

const rendererItem = computed<FormItemConfig>(() => ({
  label: labelText.value,
  prop: fieldProp.value,
  description: props.description,
  rules: props.rules,
  required: props.required,
  disabled: props.disabled,
  readonly: props.readonly,
  itemRender: props.itemRender,
}))

const field = {
  get prop() {
    return fieldProp.value
  },
  error: readonly(error),
  validate,
  clearValidate,
  resetField,
  focus,
}

watch(fieldValue, () => validate('change'), {
  deep: true,
  flush: 'sync',
})

onMounted(() => {
  if (fieldProp.value) form?.registerField(field)
})
onBeforeUnmount(() => form?.unregisterField(field))

defineSlots<{
  default(props: {
    id: string
    error: string
    validate: (trigger?: FormRuleTrigger | 'submit') => Promise<boolean>
  }): unknown
  label(props: { id: string; label: string; required: boolean }): unknown
  error(props: { error: string; description?: string }): unknown
}>()

defineExpose({ validate, clearValidate, resetField, focus, error })
</script>

<template>
  <div
    ref="root"
    :class="[
      ns.b(),
      ns.is('error', !!error),
      ns.is('required', required || hasRequiredRule),
      ns.is('nested', nested),
      ns.is(`label-${labelPosition}`),
      ns.is(`align-${align}`),
    ]"
    :style="spanStyle"
    :data-prop="fieldProp"
  >
    <label
      v-if="hasLabel"
      :for="fieldProp ? controlId : undefined"
      :class="ns.e('label')"
      :style="labelStyle"
    >
      <slot
        :id="controlId"
        name="label"
        :label="labelText"
        :required="required || hasRequiredRule"
      >
        {{ labelText }}
      </slot>
    </label>
    <div :class="ns.e('body')">
      <div :class="ns.e('content')" @focusout="handleFocusOut">
        <slot :id="controlId" :error="error" :validate="validate" />
        <FormRenderer
          v-if="itemRender && !$slots.default"
          :item="rendererItem"
          :render="itemRender"
          :control-id="controlId"
        />
      </div>
      <div
        v-if="hasMessageArea"
        :class="ns.e('message')"
        :aria-hidden="!error"
        aria-live="polite"
      >
        <slot name="error" :error="error" :description="description">
          <span v-if="error" :class="ns.e('error')" role="alert">
            {{ error }}
          </span>
          <span v-else-if="description" :class="ns.e('description')">
            {{ description }}
          </span>
        </slot>
      </div>
    </div>
  </div>
</template>
