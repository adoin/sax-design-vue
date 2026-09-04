import { cloneDeepWith, isEqualWith } from 'lodash-unified'

interface CloneStack {
  has: (key: object) => boolean
  get: (key: object) => unknown
}

/** Snapshot changed values without filling array holes or visiting their empty indices. */
export function cloneTableDataValue<T>(value: T): T {
  const copies = new WeakMap<object, unknown>()
  const clone = (input: unknown, ancestors: CloneStack[]): unknown => {
    const result = cloneDeepWith(input, (current, _key, _parent, stack) => {
      if (!current || typeof current !== 'object') return undefined
      if (copies.has(current)) return copies.get(current)
      for (const ancestor of ancestors)
        if (ancestor.has(current)) return ancestor.get(current)
      if (!Array.isArray(current)) return undefined
      const array: unknown[] = []
      array.length = current.length
      copies.set(current, array)
      const parents = stack ? [...ancestors, stack] : ancestors
      for (const key of Reflect.ownKeys(current)) {
        if (!Object.prototype.propertyIsEnumerable.call(current, key)) continue
        Object.defineProperty(array, key, {
          value: clone(Reflect.get(current, key), parents),
          enumerable: true,
          configurable: true,
          writable: true,
        })
      }
      return array
    })
    if (input && typeof input === 'object') copies.set(input, result)
    return result
  }
  return clone(value, []) as T
}

/** Array property presence is data: a hole differs from an explicit undefined. */
export function equalTableDataValue(left: unknown, right: unknown): boolean {
  const compared = new WeakMap<object, WeakSet<object>>()
  const equal = (a: unknown, b: unknown): boolean =>
    isEqualWith(a, b, (first, second) => {
      if (!Array.isArray(first) || !Array.isArray(second)) return undefined
      if (first.length !== second.length) return false
      const keys = (array: unknown[]) =>
        Reflect.ownKeys(array).filter((key) =>
          Object.prototype.propertyIsEnumerable.call(array, key),
        )
      const firstKeys = keys(first)
      const secondKeys = new Set(keys(second))
      if (
        firstKeys.length !== secondKeys.size ||
        firstKeys.some((key) => !secondKeys.has(key))
      )
        return false
      if (compared.get(first)?.has(second)) return true
      const pairs = compared.get(first) ?? new WeakSet<object>()
      pairs.add(second)
      compared.set(first, pairs)
      return firstKeys.every((key) =>
        equal(Reflect.get(first, key), Reflect.get(second, key)),
      )
    })
  return equal(left, right)
}
