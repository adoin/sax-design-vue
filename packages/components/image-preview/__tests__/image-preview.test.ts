import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import ImagePreview from '../src/image-preview.vue'
import { useImageTransform } from '../src/use-image-transform'

const mountPreview = (props: Record<string, unknown> = {}) =>
  mount(ImagePreview, {
    props: {
      modelValue: true,
      urlList: ['first.jpg', 'second.jpg'],
      altList: ['First image', 'Second image'],
      ...props,
    },
    global: {
      stubs: {
        Teleport: true,
        Transition: false,
      },
    },
  })

describe('ImagePreview', () => {
  afterEach(() => {
    document.body.className = ''
    document.body.style.cssText = ''
  })

  it('renders a complete transform toolbar and accessible image text', () => {
    const wrapper = mountPreview()

    expect(wrapper.get('img').attributes('alt')).toBe('First image')
    expect(wrapper.get('[role="toolbar"]').attributes('aria-label')).toBe(
      'Image preview controls',
    )
    expect(wrapper.find('button[aria-label="Zoom in"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Zoom out"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Rotate left"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Rotate right"]').exists()).toBe(
      true,
    )
    expect(
      wrapper.find('button[aria-label="Show original size"]').exists(),
    ).toBe(true)
    expect(wrapper.find('button[aria-label="Reset image"]').exists()).toBe(true)
  })

  it('zooms, rotates, resets, and emits transform state', async () => {
    const wrapper = mountPreview()

    await wrapper.get('button[aria-label="Zoom in"]').trigger('click')
    expect(wrapper.get('img').attributes('style')).toContain('scale(1.2)')

    await wrapper.get('button[aria-label="Rotate right"]').trigger('click')
    expect(wrapper.get('img').attributes('style')).toContain('rotate(90deg)')

    await wrapper.get('button[aria-label="Reset image"]').trigger('click')
    expect(wrapper.get('img').attributes('style')).toContain('rotate(0deg)')
    expect(wrapper.get('img').attributes('style')).toContain('scale(1)')
    expect(wrapper.emitted('transform')?.length).toBeGreaterThan(0)
  })

  it('supports keyboard transforms and image navigation', async () => {
    const wrapper = mountPreview()
    const dialog = wrapper.get('[role="dialog"]')

    await dialog.trigger('keydown', { key: 'r' })
    expect(wrapper.get('img').attributes('style')).toContain('rotate(90deg)')

    await dialog.trigger('keydown', { key: '+' })
    expect(wrapper.get('img').attributes('style')).toContain('scale(1.2)')

    await dialog.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.get('img').attributes('src')).toBe('second.jpg')
    expect(wrapper.get('img').attributes('alt')).toBe('Second image')
    expect(wrapper.emitted('switch')?.at(-1)).toEqual([1])
  })

  it('hides navigation arrows for a single image', () => {
    const wrapper = mountPreview({
      urlList: ['only.jpg'],
      altList: ['Only image'],
    })

    expect(wrapper.find('button[aria-label="Previous image"]').exists()).toBe(
      false,
    )
    expect(wrapper.find('button[aria-label="Next image"]').exists()).toBe(false)
  })

  it('keeps close behavior controlled through v-model', async () => {
    const wrapper = mountPreview()

    await wrapper.get('button[aria-label="Close"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

describe('useImageTransform', () => {
  it('recalculates fit scale after quarter-turn rotation', () => {
    const viewer = useImageTransform({
      minScale: 0.2,
      maxScale: 7,
      zoomRate: 1.2,
    })

    viewer.setViewportSize(1000, 700)
    viewer.setImageSize(1200, 800)
    expect(viewer.transform.value.scale).toBeCloseTo(0.695, 3)

    viewer.rotateRight()
    expect(viewer.transform.value.rotation).toBe(90)
    expect(viewer.transform.value.scale).toBeCloseTo(0.463, 3)
  })

  it('toggles original size and resets every transform dimension', () => {
    const viewer = useImageTransform({
      minScale: 0.2,
      maxScale: 7,
      zoomRate: 1.2,
    })

    viewer.setViewportSize(1000, 700)
    viewer.setImageSize(1200, 800)
    viewer.showOriginal()
    expect(viewer.transform.value.mode).toBe('original')
    expect(viewer.transform.value.scale).toBe(1)

    viewer.rotateLeft()
    viewer.zoomIn()
    viewer.reset()
    expect(viewer.transform.value).toMatchObject({
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      mode: 'fit',
    })
    expect(viewer.transform.value.scale).toBeCloseTo(0.695, 3)
  })
})
