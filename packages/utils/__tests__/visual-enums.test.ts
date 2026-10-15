import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'
import { resolveVisualEnumProps, visualEnumAliases } from '../visual-enums'

describe('semantic visual enum compatibility', () => {
  for (const [component, mapping] of Object.entries(visualEnumAliases)) {
    for (const [prop, canonical] of Object.entries(mapping)) {
      it(`${component}.${prop} preserves legacy visuals and reactive updates`, () => {
        const raw = reactive<Record<string, unknown>>({
          [prop]: canonical,
          untouched: undefined,
          disabled: false,
        })
        const resolved = resolveVisualEnumProps(component, raw)
        expect(resolved[prop]).toBe('default')
        expect(raw[prop]).toBe(canonical)
        expect(resolved.untouched).toBeUndefined()
        expect(resolved.disabled).toBe(false)
        expect(resolved.toString).toBe(raw.toString)
        raw[prop] = 'other'
        expect(resolved[prop]).toBe('other')
        raw[prop] = 'default'
        expect(resolved[prop]).toBe('default')
      })
    }
  }
})
