import type {
  TableValidationContext,
  TableValidationRule,
  TableValidationType,
} from './table-validation'

const empty = (value: unknown) =>
  value == null || value === '' || (Array.isArray(value) && !value.length)
const matchesType = (value: unknown, type: TableValidationType) => {
  switch (type) {
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value)
    case 'array':
      return Array.isArray(value)
    case 'date':
      return value instanceof Date && !Number.isNaN(value.getTime())
    case 'object':
      return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      )
    default:
      return typeof value === type
  }
}

export interface TableValidationMessages {
  required: (field: string) => string
  invalid: (field: string) => string
}
export const defaultTableValidationMessages: TableValidationMessages = {
  required: (field) => `${field} is required`,
  invalid: (field) => `${field} is invalid`,
}

/** Rules never coerce input values; an optional empty value skips type/length checks. */
export async function validateTableValue(
  context: TableValidationContext,
  rules: TableValidationRule[],
  messages = defaultTableValidationMessages,
): Promise<string | undefined> {
  const label = context.column.title ?? context.field
  for (const rule of rules) {
    if (context.signal.aborted) return undefined
    const value = context.value
    if (
      rule.required &&
      (empty(value) || (typeof value === 'string' && !value.trim()))
    )
      return rule.message ?? messages.required(label)
    if (value != null && value !== '') {
      if (rule.type && !matchesType(value, rule.type))
        return rule.message ?? messages.invalid(label)
      const size =
        typeof value === 'number'
          ? value
          : typeof value === 'string' || Array.isArray(value)
            ? value.length
            : undefined
      if (
        (rule.min != null && (size == null || size < rule.min)) ||
        (rule.max != null && (size == null || size > rule.max))
      )
        return rule.message ?? messages.invalid(label)
      // Avoid mutating a consumer's global/sticky RegExp.lastIndex.
      if (
        rule.pattern &&
        (typeof value !== 'string' ||
          !new RegExp(rule.pattern.source, rule.pattern.flags).test(value))
      )
        return rule.message ?? messages.invalid(label)
    }
    if (rule.validator) {
      try {
        const result = await rule.validator(context)
        if (result === false) return rule.message ?? messages.invalid(label)
        if (typeof result === 'string')
          return result || rule.message || messages.invalid(label)
        if (result instanceof Error)
          return result.message || rule.message || messages.invalid(label)
      } catch (error) {
        if (context.signal.aborted) return undefined
        return (
          rule.message ??
          (error instanceof Error && error.message
            ? error.message
            : messages.invalid(label))
        )
      }
    }
  }
  return undefined
}

/** Abort must settle even when a remote validator ignores its signal. */
export function awaitValidation<T>(
  promise: Promise<T>,
  signal: AbortSignal,
): Promise<T | undefined> {
  if (signal.aborted) return Promise.resolve(undefined)
  return new Promise((resolve, reject) => {
    const abort = () => {
      signal.removeEventListener('abort', abort)
      resolve(undefined)
    }
    signal.addEventListener('abort', abort, { once: true })
    promise.then(
      (value) => {
        signal.removeEventListener('abort', abort)
        resolve(value)
      },
      (error) => {
        signal.removeEventListener('abort', abort)
        reject(error)
      },
    )
  })
}
