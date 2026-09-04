import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Image from '../src/image.vue'

const mountImage = (options: Parameters<typeof mount>[1] = {}) =>
  mount(Image, {
    ...options,
    global: {
      stubs: {
        Teleport: true,
        Transition: false,
      },
      ...options.global,
    },
  })

describe('SImage', () => {
  it('fits a semantic image into an independently sized box', () => {
    const wrapper = mountImage({
      props: {
        src: 'portrait.jpg',
        alt: 'Portrait',
        fit: 'contain',
        position: 'top center',
        width: 240,
        aspectRatio: '16 / 9',
        loading: 'lazy',
        decoding: 'async',
      },
    })

    expect(wrapper.get('.s-images__item').attributes('style')).toContain(
      'width: 240px',
    )
    expect(wrapper.get('.s-images__wrap').attributes('style')).toContain(
      'aspect-ratio: 16 / 9',
    )

    const image = wrapper.get('img.s-images__img')
    expect(image.attributes()).toMatchObject({
      src: 'portrait.jpg',
      alt: 'Portrait',
      loading: 'lazy',
      decoding: 'async',
    })
    expect(image.attributes('style')).toContain('object-fit: contain')
    expect(image.attributes('style')).toContain('object-position: top center')
  })

  it('forwards native responsive image attributes', () => {
    const wrapper = mountImage({
      props: { src: 'small.jpg', alt: 'Responsive image' },
      attrs: {
        srcset: 'small.jpg 480w, large.jpg 960w',
        sizes: '(max-width: 600px) 480px, 960px',
      },
    })

    expect(wrapper.get('img.s-images__img').attributes()).toMatchObject({
      srcset: 'small.jpg 480w, large.jpg 960w',
      sizes: '(max-width: 600px) 480px, 960px',
    })
  })

  it('exposes loading and error states with customizable slots', async () => {
    const wrapper = mountImage({
      props: { src: 'photo.jpg', alt: 'Photo' },
      slots: {
        placeholder: '<span class="custom-placeholder">Loading</span>',
        error: '<span class="custom-error">Unavailable</span>',
      },
    })

    expect(wrapper.find('.custom-placeholder').exists()).toBe(true)
    await wrapper.get('img.s-images__img').trigger('load')
    expect(wrapper.find('.custom-placeholder').exists()).toBe(false)
    expect(wrapper.emitted('load')).toHaveLength(1)

    await wrapper.setProps({ src: 'missing.jpg' })
    expect(wrapper.find('.custom-placeholder').exists()).toBe(true)
    await wrapper.get('img.s-images__img').trigger('error')
    expect(wrapper.find('.custom-error').exists()).toBe(true)
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('opens preview with keyboard button semantics', async () => {
    const wrapper = mountImage({
      props: { src: 'photo.jpg', alt: 'Preview photo', preview: true },
    })
    const item = wrapper.get('.s-images__item')

    expect(item.attributes()).toMatchObject({ role: 'button', tabindex: '0' })
    await item.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('preview')).toHaveLength(1)
  })
})
