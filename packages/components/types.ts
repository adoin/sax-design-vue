/** Default dictionary shape used when an application does not supply a model. */
export type Recordable<T = any> = Record<string, T>

export interface AnchorRouteLocation {
  path: string
  fullPath?: string
}

/** Minimal structural contract shared by Vue Router and compatible routers. */
export interface AnchorRouterAdapter {
  push: (href: string) => unknown
  replace?: (href: string) => unknown
  current?: () => string
  currentRoute?: AnchorRouteLocation | { value: AnchorRouteLocation }
}

export interface AnchorRouteBoundaryOptions {
  threshold?: number
  armDelay?: number
  routeCooldown?: number
}

type FieldPathLeaf =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | Date
  | RegExp
  | ((...args: any[]) => any)
  | readonly unknown[]
type DirectField<Value> = Extract<keyof Value, string>
type ChildFieldPath<Value> = Value extends object
  ? {
      [Key in DirectField<Value>]: NonNullable<Value[Key]> extends FieldPathLeaf
        ? Key
        : NonNullable<Value[Key]> extends object
          ? Key | `${Key}.${DirectField<NonNullable<Value[Key]>>}`
          : Key
    }[DirectField<Value>]
  : never
type NestedFieldPath<Value> = Value extends object
  ? {
      [Key in DirectField<Value>]: NonNullable<Value[Key]> extends FieldPathLeaf
        ? Key
        : NonNullable<Value[Key]> extends object
          ? Key | `${Key}.${ChildFieldPath<NonNullable<Value[Key]>>}`
          : Key
    }[DirectField<Value>]
  : never

/** String field paths for a concrete record; dynamic dictionaries stay open. */
export type FieldPath<Value extends object> = string extends keyof Value
  ? string
  : [keyof Value] extends [never]
    ? string
    : NestedFieldPath<Value>

/** Value resolved from a valid dot-separated field path. */
export type FieldPathValue<
  Value,
  Path extends string,
> = Path extends `${infer Head}.${infer Tail}`
  ? Head extends keyof Value
    ? FieldPathValue<NonNullable<Value[Head]>, Tail>
    : unknown
  : Path extends keyof Value
    ? Value[Path]
    : unknown
