import type { vsPropKey } from './runtime'
import type { ExtractPropTypes, PropType } from 'vue'
import type { IfNever, UnknownToNever, WritableArray } from './util'

type Value<T> = T[keyof T]

/**
 * Extract the type of a single prop
 *
 * @example
 * ExtractPropType<{ type: StringConstructor }> => string | undefined
 * ExtractPropType<{ type: StringConstructor, required: true }> => string
 * ExtractPropType<{ type: BooleanConstructor }> => boolean
 */
export type ExtractPropType<T extends object> = Value<
  ExtractPropTypes<{
    key: T
  }>
>

/**
 * Extracts types via `ExtractPropTypes`, accepting `PropType<T>`, `XXXConstructor`, `never`...
 *
 * @example
 * ResolvePropType<BooleanConstructor> => boolean
 * ResolvePropType<PropType<T>> => T
 **/
export type ResolvePropType<T> = IfNever<
  T,
  never,
  ExtractPropType<{
    type: WritableArray<T>
    required: true
  }>
>

/**
 * Merge Type, Value, Validator types
 *
 * @example
 * SPropMergeType<StringConstructor, '1', 1> =>  1 | "1" // ignores StringConstructor
 * SPropMergeType<StringConstructor, never, number> =>  string | number
 */
export type SPropMergeType<Type, Value, Validator> =
  | IfNever<UnknownToNever<Value>, ResolvePropType<Type>, never>
  | UnknownToNever<Value>
  | UnknownToNever<Validator>

/**
 * Handling default values for input (constraints)
 */
export type SPropInputDefault<
  Required extends boolean,
  Default
> = Required extends true
  ? never
  : Default extends Record<string, unknown> | Array<any>
  ? () => Default
  : (() => Default) | Default

/**
 * Native prop types, e.g: `BooleanConstructor`, `StringConstructor`, `null`, `undefined`, etc.
 */
export type NativePropType =
  | ((...args: any) => any)
  | { new (...args: any): any }
  | undefined
  | null
export type IfNativePropType<T, Y, N> = [T] extends [NativePropType] ? Y : N

/**
 * input prop `buildProp` or `buildProps` (constraints)
 *
 * @example
 * SPropInput<StringConstructor, 'a', never, never, true>
 * ⬇️
 * {
    type?: StringConstructor | undefined;
    required?: true | undefined;
    values?: readonly "a"[] | undefined;
    validator?: ((val: any) => boolean) | ((val: any) => val is never) | undefined;
    default?: undefined;
  }
 */
export type SPropInput<
  Type,
  Value,
  Validator,
  Default extends SPropMergeType<Type, Value, Validator>,
  Required extends boolean
> = {
  type?: Type
  required?: Required
  values?: readonly Value[]
  validator?: ((val: any) => val is Validator) | ((val: any) => boolean)
  default?: SPropInputDefault<Required, Default>
}

/**
 * output prop `buildProp` or `buildProps`.
 *
 * @example
 * SProp<'a', 'b', true>
 * ⬇️
 * {
    readonly type: PropType<"a">;
    readonly required: true;
    readonly validator: ((val: unknown) => boolean) | undefined;
    readonly default: "b";
    __vsPropKey: true;
  }
 */
export type SProp<Type, Default, Required> = {
  readonly type: PropType<Type>
  readonly required: [Required] extends [true] ? true : false
  readonly validator: ((val: unknown) => boolean) | undefined
  [vsPropKey]: true
} & IfNever<Default, unknown, { readonly default: Default }>

/**
 * Determine if it is `SProp`
 */
export type IfVsProp<T, Y, N> = T extends { [vsPropKey]: true } ? Y : N

/**
 * Converting input to output.
 */
export type SPropConvert<Input> = Input extends SPropInput<
  infer Type,
  infer Value,
  infer Validator,
  any,
  infer Required
>
  ? SPropFinalized<Type, Value, Validator, Input['default'], Required>
  : never

/**
 * Finalized conversion output
 */
export type SPropFinalized<Type, Value, Validator, Default, Required> = SProp<
  SPropMergeType<Type, Value, Validator>,
  UnknownToNever<Default>,
  Required
>

export {}
