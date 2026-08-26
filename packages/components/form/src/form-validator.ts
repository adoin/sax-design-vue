import type {
  FormItemConfig,
  FormModel,
  FormRule,
  FormRuleTrigger,
  FormRules,
} from './form'

export interface FormFieldValidationResult {
  field: string
  valid: boolean
  message: string
}

export interface FormValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export interface FormValidatorOptions {
  rules?: FormRules
  items?: FormItemConfig[]
}

interface ResolvedFormField {
  field: string
  label: string
  rules?: FormRule | FormRule[]
  visible: boolean
}

export const getFormValue = (model: FormModel, prop: string) =>
  prop
    .split('.')
    .filter(Boolean)
    .reduce<unknown>(
      (value, key) =>
        value && typeof value === 'object'
          ? (value as Record<string, unknown>)[key]
          : undefined,
      model,
    )

export const isFormValueEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === '' ||
  (Array.isArray(value) && !value.length)

export const formRuleMatchesTrigger = (
  rule: FormRule,
  trigger?: FormRuleTrigger | 'submit',
) => {
  if (!trigger || trigger === 'submit') return true
  if (!rule.trigger) return trigger === 'blur'
  return (Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger]).includes(
    trigger,
  )
}

export const validateFormValue = ({
  field,
  label,
  value,
  model,
  rules,
  trigger = 'submit',
}: {
  field: string
  label?: string
  value: unknown
  model: FormModel
  rules: FormRule[]
  trigger?: FormRuleTrigger | 'submit'
}): FormFieldValidationResult | Promise<FormFieldValidationResult> => {
  const applicableRules = rules.filter((rule) =>
    formRuleMatchesTrigger(rule, trigger),
  )

  const validResult = (): FormFieldValidationResult => ({
    field,
    valid: true,
    message: '',
  })
  const invalidResult = (message: string): FormFieldValidationResult => ({
    field,
    valid: false,
    message,
  })
  const validateFrom = (
    startIndex: number,
  ): FormFieldValidationResult | Promise<FormFieldValidationResult> => {
    for (let index = startIndex; index < applicableRules.length; index++) {
      const rule = applicableRules[index]
      if (rule.required && isFormValueEmpty(value)) {
        return invalidResult(rule.message || `${label || field} is required`)
      } else if (rule.validator && !isFormValueEmpty(value)) {
        const result = rule.validator(value, model)
        if (result instanceof Promise)
          return result.then((resolved) =>
            resolved === true
              ? validateFrom(index + 1)
              : invalidResult(
                  typeof resolved === 'string'
                    ? resolved
                    : rule.message || `${label || field} is invalid`,
                ),
          )
        if (result !== true)
          return invalidResult(
            typeof result === 'string'
              ? result
              : rule.message || `${label || field} is invalid`,
          )
      }
    }
    return validResult()
  }

  return validateFrom(0)
}

const toRuleList = (rules?: FormRule | FormRule[]) =>
  rules ? (Array.isArray(rules) ? rules : [rules]) : []

const resolveFields = (model: FormModel, items: FormItemConfig[]) => {
  const fields = new Map<string, ResolvedFormField>()

  const visit = (item: FormItemConfig, parentVisible: boolean) => {
    const visible =
      parentVisible &&
      item.visible !== false &&
      (!item.visibleMethod || item.visibleMethod({ model, item }))
    const field = item.prop ?? item.field
    if (field && !fields.has(field))
      fields.set(field, {
        field,
        label: item.label ?? item.title ?? field,
        rules: item.rules,
        visible,
      })
    item.children?.forEach((child) => visit(child, visible))
  }

  items.forEach((item) => visit(item, true))
  return fields
}

/**
 * Creates an imperative validator that does not mount any Vue component or DOM.
 * It is suitable for lazy form tabs and external pre-submit validation.
 */
export const createFormValidator = (
  model: FormModel,
  options: FormValidatorOptions = {},
) => {
  const resolvedFields = () => resolveFields(model, options.items ?? [])

  const validateField = async (
    field: string,
    trigger: FormRuleTrigger | 'submit' = 'submit',
  ) => {
    const item = resolvedFields().get(field)
    if (item && !item.visible)
      return {
        field,
        valid: true,
        message: '',
      } satisfies FormFieldValidationResult

    return validateFormValue({
      field,
      label: item?.label,
      value: getFormValue(model, field),
      model,
      rules: toRuleList(item?.rules ?? options.rules?.[field]),
      trigger,
    })
  }

  const validate = async (selectedFields?: string[]) => {
    const itemFields = resolvedFields()
    const fields = selectedFields
      ? [...new Set(selectedFields)]
      : [
          ...[...itemFields.values()]
            .filter((item) => item.visible)
            .map((item) => item.field),
          ...Object.keys(options.rules ?? {}).filter(
            (field) => !itemFields.has(field),
          ),
        ]
    const results = await Promise.all(
      fields.map((field) => validateField(field)),
    )
    const errors = results.reduce<Record<string, string>>((all, result) => {
      if (!result.valid) all[result.field] = result.message
      return all
    }, {})
    return {
      valid: !Object.keys(errors).length,
      errors,
    } satisfies FormValidationResult
  }

  return { validate, validateField }
}
