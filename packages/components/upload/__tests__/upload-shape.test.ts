import { flushPromises, mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Upload from '../src/upload.vue'

describe('Upload shape', () => {
  it('applies square geometry to the upload surface', () => {
    const wrapper = shallowMount(Upload, { props: { shape: 'square' } })

    expect(wrapper.classes()).toContain('is-square')
  })

  it('adds dropped files to the controlled queue', async () => {
    const wrapper = mount(Upload, { props: { multiple: true } })
    const files = [
      new File(['first'], 'first.txt', { type: 'text/plain' }),
      new File(['second'], 'second.txt', { type: 'text/plain' }),
    ]

    await wrapper.find('[role="button"]').trigger('drop', {
      dataTransfer: { files },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('first.txt')
    expect(wrapper.text()).toContain('second.txt')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(files)
  })

  it('validates dropped files with the same accept rules as the picker', async () => {
    const wrapper = mount(Upload, { props: { accept: 'image/*' } })
    const file = new File(['notes'], 'notes.txt', { type: 'text/plain' })

    await wrapper.find('[role="button"]').trigger('drop', {
      dataTransfer: { files: [file] },
    })
    await flushPromises()

    expect(wrapper.emitted('reject')?.[0]?.[1]).toBe('type')
    expect(wrapper.find('.s-upload__item').exists()).toBe(false)
  })

  it('keeps a failed item in the queue and retries it', async () => {
    let attempts = 0
    const wrapper = mount(Upload, {
      props: {
        automatic: true,
        uploadMethod: async ({ updateProgress }) => {
          attempts += 1
          updateProgress(45)
          if (attempts === 1) throw new Error('Network unavailable')
          return { ok: true }
        },
      },
    })
    const file = new File(['report'], 'report.pdf', {
      type: 'application/pdf',
    })

    await wrapper.find('[role="button"]').trigger('drop', {
      dataTransfer: { files: [file] },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Network unavailable')
    await wrapper.find('.s-upload__action').trigger('click')
    await flushPromises()

    expect(attempts).toBe(2)
    expect(wrapper.emitted('retry')).toHaveLength(1)
    expect(wrapper.find('.is-success').exists()).toBe(true)
  })

  it('opens the picker from the keyboard-accessible upload surface', async () => {
    const wrapper = mount(Upload)
    const input = wrapper.find('input[type="file"]')
    let clicks = 0
    input.element.addEventListener('click', () => {
      clicks += 1
    })

    await wrapper.find('[role="button"]').trigger('keydown', { key: 'Enter' })

    expect(clicks).toBe(1)
  })
})
