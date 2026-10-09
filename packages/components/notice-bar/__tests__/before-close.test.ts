import { nextTick } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import NoticeBar from '../src/notice-bar.vue'
import type { NoticeBarBeforeCloseFn } from '../src/notice-bar'

enableAutoUnmount(afterEach)
const settle = async () => {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}
beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('IntersectionObserver', undefined)
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('NoticeBar beforeClose', () => {
  it('does not invoke a queued guard after immediate reopening or teardown', async () => {
    for (const cancel of ['reopen', 'unmount']) {
      const guard = vi.fn<NoticeBarBeforeCloseFn>().mockResolvedValue(undefined)
      const wrapper = mount(NoticeBar, { props: { beforeClose: guard } })
      const closing = wrapper.vm.close()
      if (cancel === 'reopen') wrapper.vm.open()
      else wrapper.unmount()
      await expect(closing).resolves.toBe(false)
      expect(guard).not.toHaveBeenCalled()
    }
  })
  it('merges pending requests, preserves visibility and pauses autoplay until approval', async () => {
    let approve!: () => void
    const guard = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          approve = resolve
        }),
    )
    const wrapper = mount(NoticeBar, {
      props: {
        beforeClose: guard,
        closable: true,
        items: ['One', 'Two'],
        interval: 500,
      },
    })
    await settle()
    const first = wrapper.vm.close()
    const second = wrapper.vm.close()
    expect(second).toBe(first)
    await settle()
    expect(guard).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.closePending).toBe(true)
    expect(
      wrapper.find('.s-notice-bar__close').attributes('disabled'),
    ).toBeDefined()
    expect(wrapper.vm.visible).toBe(true)
    await vi.advanceTimersByTimeAsync(1500)
    expect(wrapper.vm.activeIndex).toBe(0)
    expect(wrapper.emitted('close')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    approve()
    await expect(first).resolves.toBe(true)
    await settle()
    expect(wrapper.vm.visible).toBe(false)
    expect(wrapper.vm.closePending).toBe(false)
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })
  it('keeps rejected close-button requests visible and allows retry', async () => {
    const reason = new Error('Keep this notice')
    const guard = vi
      .fn<NoticeBarBeforeCloseFn>()
      .mockRejectedValueOnce(reason)
      .mockResolvedValue(undefined)
    const wrapper = mount(NoticeBar, {
      props: { beforeClose: guard, closable: true },
    })
    await wrapper.find('.s-notice-bar__close').trigger('click')
    await settle()
    expect(wrapper.vm.visible).toBe(true)
    expect(wrapper.vm.closePending).toBe(false)
    expect(wrapper.emitted('closeError')).toEqual([[reason]])
    expect(wrapper.emitted('close')).toBeUndefined()
    await wrapper.find('.s-notice-bar__close').trigger('click')
    await settle()
    expect(wrapper.vm.visible).toBe(false)
    expect(guard).toHaveBeenCalledTimes(2)
  })
  it.each([
    () => {
      throw new Error('Failure')
    },
    () => undefined,
  ])('rejects thrown or non-Promise approvals', async (guard) => {
    const wrapper = mount(NoticeBar, {
      props: { beforeClose: guard as unknown as NoticeBarBeforeCloseFn },
    })
    await expect(wrapper.vm.close()).resolves.toBe(false)
    expect(wrapper.vm.visible).toBe(true)
    expect(wrapper.emitted('closeError')).toHaveLength(1)
  })
  it('guards slot closure and leaves controlled visibility to the owner after approval', async () => {
    let approve!: () => void
    const wrapper = mount(NoticeBar, {
      props: {
        modelValue: true,
        beforeClose: () =>
          new Promise<void>((resolve) => {
            approve = resolve
          }),
      },
      slots: {
        actions:
          '<template #actions="{ close, closePending }"><button :disabled="closePending" @click="close">Close</button></template>',
      },
    })
    await wrapper.find('.s-notice-bar__actions button').trigger('click')
    await settle()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    approve()
    await settle()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.vm.visible).toBe(true)
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.vm.visible).toBe(false)
  })
  it('ignores stale approval after reopen, external hiding or unmount', async () => {
    for (const cancel of ['reopen', 'hide', 'unmount']) {
      let approve!: () => void
      const wrapper = mount(NoticeBar, {
        props: {
          beforeClose: () =>
            new Promise<void>((resolve) => {
              approve = resolve
            }),
        },
      })
      const closing = wrapper.vm.close()
      await settle()
      if (cancel === 'reopen') wrapper.vm.open()
      else if (cancel === 'hide') await wrapper.setProps({ modelValue: false })
      else wrapper.unmount()
      approve()
      await expect(closing).resolves.toBe(false)
      expect(wrapper.emitted('close')).toBeUndefined()
      expect(wrapper.emitted('closeError')).toBeUndefined()
    }
  })
  it('captures the guard once while preserving immediate unguarded closing', async () => {
    let approve!: () => void
    const wrapper = mount(NoticeBar, {
      props: {
        beforeClose: () =>
          new Promise<void>((resolve) => {
            approve = resolve
          }),
      },
    })
    const closing = wrapper.vm.close()
    await settle()
    const replacement = vi.fn().mockRejectedValue('new guard')
    await wrapper.setProps({ beforeClose: replacement })
    approve()
    await expect(closing).resolves.toBe(true)
    expect(replacement).not.toHaveBeenCalled()
    const plain = mount(NoticeBar)
    const result = plain.vm.close()
    expect(plain.vm.visible).toBe(false)
    await expect(result).resolves.toBe(true)
  })
})
