import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useTableValidation } from '../src/composables/use-table-validation'
import {
  awaitValidation,
  validateTableValue,
  validateTableValueSync,
} from '../src/validation-utils'
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
    expect(validateTableValueSync(context(''), [{ required: true }])).toBe(
      'Value is required',
    )
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
    expect(validation.running.value).toBe(true)
    controller.abort()
    expect(await pending).toMatchObject({ cancelled: true })
    expect(validation.running.value).toBe(false)
    const unmounted = validation.run([
      cell('B', [{ validator: () => new Promise(() => {}) }]),
    ])
    wrapper.unmount()
    expect(await unmounted).toMatchObject({ cancelled: true })
    expect(validation.running.value).toBe(false)
    expect(emit).not.toHaveBeenCalled()
    expect(validation.pending.value).toBeNull()
  })

  it('does not publish an earlier error whose value changed while a later field was pending', async () => {
    const { wrapper, validation, emit } = harness()
    let value = ''
    let finish!: (value: boolean) => void
    const pending = validation.run([
      { ...cell('', [{ required: true }]), readValue: () => value },
      cell(
        'Later',
        [
          {
            validator: () =>
              new Promise((resolve) => {
                finish = resolve
              }),
          },
        ],
        2,
      ),
    ])
    while (!finish) await Promise.resolve()
    value = 'Corrected'
    finish(true)
    expect(await pending).toMatchObject({ cancelled: true, errors: [] })
    expect(emit).not.toHaveBeenCalled()
    const locate = vi.fn(() => true)
    const result = await validation.run([
      { ...cell('', [{ required: true }]), readValue: () => value, locate },
    ])
    expect(result.cancelled).toBe(true)
    value = ''
    const failed = await validation.run([
      { ...cell('', [{ required: true }]), readValue: () => value, locate },
    ])
    value = 'Corrected'
    expect(await validation.scrollToError(failed.errors[0])).toBe(false)
    expect(locate).not.toHaveBeenCalled()
    wrapper.unmount()
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
    expect(validation.errorCountTruncated.value).toBe(true)
    validation.clear()
    expect(validation.errorCountTruncated.value).toBe(false)
    wrapper.unmount()
  })

  it('keeps built-in-only scans synchronous until their time budget is spent', async () => {
    const { wrapper, validation } = harness()
    const clock = vi.spyOn(Date, 'now').mockReturnValue(0)
    const timeout = vi.spyOn(globalThis, 'setTimeout')
    function* cells() {
      for (let id = 0; id < 10_000; id++)
        yield cell('OK', [{ required: true }], id)
    }

    const result = await validation.run(cells())
    expect(result).toMatchObject({ valid: true, checked: 10_000 })
    expect(timeout).not.toHaveBeenCalled()
    clock.mockRestore()
    timeout.mockRestore()
    wrapper.unmount()
  })

  it('runs custom validators in a bounded stage without reading past maxErrors', async () => {
    const { wrapper, validation } = harness()
    const resolvers: Array<(value: boolean) => void> = []
    let active = 0
    let maximumActive = 0
    let read = 0
    function* cells() {
      for (let id = 0; id < 100; id++) {
        read++
        yield cell(
          'OK',
          [
            {
              validator: () =>
                new Promise<boolean>((resolve) => {
                  active++
                  maximumActive = Math.max(maximumActive, active)
                  resolvers.push((value) => {
                    active--
                    resolve(value)
                  })
                }),
            },
          ],
          id,
        )
      }
    }

    const pending = validation.run(cells(), {
      concurrency: 8,
      maxErrors: 3,
      clear: true,
    })
    await vi.waitFor(() => expect(resolvers).toHaveLength(3))
    expect(read).toBe(3)
    expect(maximumActive).toBe(3)
    expect([0, 1, 2].every((id) => validation.isPending(id, 'value'))).toBe(
      true,
    )
    resolvers.forEach((resolve) => resolve(false))

    const result = await pending
    expect(result).toMatchObject({
      valid: false,
      truncated: true,
      cancelled: false,
      checked: 3,
    })
    expect(result.errors.map((error) => error.rowKey)).toEqual([0, 1, 2])
    expect(read).toBe(3)
    wrapper.unmount()
  })

  it('yields during a large valid batch so an external signal can stop it', async () => {
    const { wrapper, validation } = harness()
    const controller = new AbortController()
    let now = 0
    const clock = vi.spyOn(Date, 'now').mockImplementation(() => now)
    let read = 0
    function* cells() {
      for (let id = 0; id < 1_000_000; id++) {
        read++
        if (read === 256) now = 9
        yield cell('OK', [{ required: true }], id)
      }
    }
    setTimeout(() => controller.abort(), 0)
    const result = await validation.run(cells(), { signal: controller.signal })
    expect(result.cancelled).toBe(true)
    expect(read).toBe(256)
    clock.mockRestore()
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

  it('opens, cycles, and closes navigation without clearing field errors', async () => {
    const { wrapper, validation } = harness()
    const first = vi.fn(() => true)
    const second = vi.fn(() => true)
    await validation.run([
      { ...cell('', [{ required: true }], 1), locate: first },
      { ...cell('', [{ required: true }], 2), locate: second },
    ])

    expect(validation.navigationVisible.value).toBe(true)
    expect(validation.errorCount.value).toBe(2)
    expect(validation.activeError.value?.rowKey).toBe(1)
    expect(validation.activeErrorIndex.value).toBe(0)

    expect(await validation.navigate(1)).toBe(true)
    expect(second).toHaveBeenCalledTimes(1)
    expect(validation.activeError.value?.rowKey).toBe(2)
    expect(validation.activeErrorIndex.value).toBe(1)

    validation.closeNavigation()
    expect(validation.navigationVisible.value).toBe(false)
    expect(validation.getErrors()).toHaveLength(2)
    expect(await validation.activate(1, 'value')).toBe(true)
    expect(first).toHaveBeenCalledTimes(1)
    expect(validation.navigationVisible.value).toBe(true)

    validation.clear()
    expect(validation.navigationVisible.value).toBe(false)
    expect(validation.activeError.value).toBeUndefined()
    wrapper.unmount()
  })
})
