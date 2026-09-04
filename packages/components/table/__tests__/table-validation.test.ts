import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useTableValidation } from '../src/composables/use-table-validation'
import { awaitValidation, validateTableValue } from '../src/validation-utils'
import type {
  TableValidationCell,
  TableValidationContext,
  TableValidationRule,
} from '../src/table-validation'

const context = (value: unknown): TableValidationContext => ({
  row: { id: 1, value },
  draftRow: { id: 1, value },
  rowKey: 1,
  rowIndex: 0,
  column: { field: 'value', title: 'Value' },
  columnIndex: 0,
  field: 'value',
  value,
  signal: new AbortController().signal,
})
const cell = (
  value: unknown,
  rules: TableValidationRule[],
  id: string | number = 1,
): TableValidationCell => ({
  ...context(value),
  rowKey: id,
  rules,
  isCurrent: () => true,
  readValue: () => value,
})
const harness = () => {
  const emit = vi.fn()
  const Host = defineComponent({
    setup: () => ({ validation: useTableValidation(emit) }),
    render: () => h('div'),
  })
  const wrapper = mount(Host)
  return { wrapper, validation: wrapper.vm.validation, emit }
}

describe('table validation rules', () => {
  it('validates required values without treating false or zero as empty', async () => {
    for (const value of [undefined, null, '', '   ', []])
      expect(
        await validateTableValue(context(value), [{ required: true }]),
      ).toBe('Value is required')
    for (const value of [false, 0])
      expect(
        await validateTableValue(context(value), [{ required: true }]),
      ).toBeUndefined()
    expect(
      await validateTableValue(context(''), [{ type: 'number' }]),
    ).toBeUndefined()
  })

  it('checks types, numeric limits, string/array lengths, and stateful patterns without coercion', async () => {
    const invalid = [
      ['3', { type: 'number' }],
      [Number.NaN, { type: 'number' }],
      [1.5, { type: 'integer' }],
      ['true', { type: 'boolean' }],
      [{}, { type: 'array' }],
      [[], { type: 'object' }],
      [new Date('bad'), { type: 'date' }],
      [3, { min: 4 }],
      ['abcd', { max: 3 }],
      [[1], { min: 2 }],
    ] as Array<[unknown, TableValidationRule]>
    for (const [value, rule] of invalid)
      expect(await validateTableValue(context(value), [rule])).toBe(
        'Value is invalid',
      )
    const pattern = /^A/g
    pattern.lastIndex = 4
    for (let i = 0; i < 2; i++)
      expect(
        await validateTableValue(context('Alpha'), [{ pattern }]),
      ).toBeUndefined()
    expect(pattern.lastIndex).toBe(4)
  })

  it('supports cross-field sync/async checks, rejected validators, and localized messages', async () => {
    const custom = vi.fn(
      async (params: TableValidationContext) =>
        params.value === params.draftRow.value || 'Mismatch',
    )
    expect(
      await validateTableValue(context('A'), [{ validator: custom }]),
    ).toBeUndefined()
    expect(custom.mock.calls[0][0].signal).toBeInstanceOf(AbortSignal)
    expect(
      await validateTableValue(context(''), [
        { validator: () => false, message: '请填写' },
      ]),
    ).toBe('请填写')
    expect(
      await validateTableValue(context('A'), [
        {
          validator: async () => {
            throw new Error('Unavailable')
          },
        },
      ]),
    ).toBe('Unavailable')
    expect(
      await validateTableValue(context('A'), [
        { validator: () => new Error('Denied') },
      ]),
    ).toBe('Denied')
  })

  it('removes abort listeners after both settlement and cancellation', async () => {
    const controller = new AbortController()
    const remove = vi.spyOn(controller.signal, 'removeEventListener')
    expect(await awaitValidation(Promise.resolve(1), controller.signal)).toBe(1)
    expect(remove).toHaveBeenCalledTimes(1)
    const never = awaitValidation(new Promise(() => {}), controller.signal)
    controller.abort()
    expect(await never).toBeUndefined()
    expect(remove).toHaveBeenCalledTimes(2)
  })
})

describe('table validation sessions', () => {
  it('publishes sparse field errors, locates the first one, and keeps returned snapshots separate', async () => {
    const { wrapper, validation, emit } = harness()
    const locate = vi.fn(() => true)
    const result = await validation.run(
      [{ ...cell('', [{ required: true }]), locate }],
      { scrollToError: true },
    )
    expect(result).toMatchObject({
      valid: false,
      cancelled: false,
      checked: 1,
      errors: [{ message: 'Value is required' }],
    })
    expect(locate).toHaveBeenCalledTimes(1)
    result.errors[0].message = 'Changed by consumer'
    emit.mock.calls[0][0].errors[0].message = 'Changed by listener'
    expect(validation.getError(1, 'value')?.message).toBe('Value is required')
    await validation.run([cell('Valid', [{ required: true }])])
    expect(validation.getErrors()).toEqual([])
    expect(await validation.scrollToError()).toBe(false)
    wrapper.unmount()
  })

  it('aborts an obsolete non-cooperative validator when a newer validation starts', async () => {
    const { wrapper, validation, emit } = harness()
    let finish!: (value: string) => void
    let signal!: AbortSignal
    const old = validation.run([
      cell('Old', [
        {
          validator: (params) => {
            signal = params.signal
            return new Promise((resolve) => {
              finish = resolve
            })
          },
        },
      ]),
    ])
    expect(validation.isPending(1, 'value')).toBe(true)
    const current = await validation.run([
      cell('Current', [{ required: true }]),
    ])
    expect(current.valid).toBe(true)
    expect(signal.aborted).toBe(true)
    expect(await old).toMatchObject({
      valid: false,
      cancelled: true,
      errors: [],
    })
    finish('Late error')
    await Promise.resolve()
    expect(validation.getErrors()).toEqual([])
    expect(emit).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('rejects results for changed values or replaced rows', async () => {
    const { wrapper, validation } = harness()
    for (const replace of [false, true]) {
      let finish!: (value: boolean) => void
      let value = 'Before'
      let current = true
      const pending = validation.run([
        {
          ...cell(value, [
            {
              validator: () =>
                new Promise((resolve) => {
                  finish = resolve
                }),
            },
          ]),
          isCurrent: () => current,
          readValue: () => value,
        },
      ])
      if (replace) current = false
      else value = 'After'
      finish(false)
      expect(await pending).toMatchObject({ cancelled: true, errors: [] })
      expect(validation.getErrors()).toEqual([])
    }
    wrapper.unmount()
  })

  it('accepts external cancellation and unmount without waiting for the validator', async () => {
    const { wrapper, validation, emit } = harness()
    const controller = new AbortController()
    const pending = validation.run(
      [cell('A', [{ validator: () => new Promise(() => {}) }])],
      { signal: controller.signal },
    )
    controller.abort()
    expect(await pending).toMatchObject({ cancelled: true })
    const unmounted = validation.run([
      cell('B', [{ validator: () => new Promise(() => {}) }]),
    ])
    wrapper.unmount()
    expect(await unmounted).toMatchObject({ cancelled: true })
    expect(emit).not.toHaveBeenCalled()
    expect(validation.pending.value).toBeNull()
  })

  it('walks a lazy batch only until the error limit and explicitly reports truncation', async () => {
    const { wrapper, validation } = harness()
    let read = 0
    function* cells() {
      for (let id = 0; id < 1_000_000; id++) {
        read++
        yield cell('', [{ required: true }], id)
      }
    }
    const result = await validation.run(cells(), { maxErrors: 3, clear: true })
    expect(result).toMatchObject({
      valid: false,
      truncated: true,
      cancelled: false,
      checked: 3,
    })
    expect(result.errors).toHaveLength(3)
    expect(read).toBe(3)
    expect(validation.getErrors()).toHaveLength(3)
    wrapper.unmount()
  })

  it('yields during a large valid batch so an external signal can stop it', async () => {
    const { wrapper, validation } = harness()
    const controller = new AbortController()
    let read = 0
    function* cells() {
      for (let id = 0; id < 1_000_000; id++) {
        read++
        yield cell('OK', [{ required: true }], id)
      }
    }
    setTimeout(() => controller.abort(), 0)
    const result = await validation.run(cells(), { signal: controller.signal })
    expect(result.cancelled).toBe(true)
    expect(read).toBeLessThanOrEqual(101)
    wrapper.unmount()
  })

  it('keeps string/number row keys separate and clears only the requested errors', async () => {
    const { wrapper, validation } = harness()
    await validation.run([
      cell('', [{ required: true }], 1),
      cell('', [{ required: true }], '1'),
    ])
    validation.clear(1, 'value')
    expect(validation.getError(1, 'value')).toBeUndefined()
    expect(validation.getError('1', 'value')).toBeDefined()
    wrapper.unmount()
  })
})
