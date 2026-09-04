import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Watermark from '../src/watermark.vue'
import {
  createWatermarkMask,
  revealWatermarkPixels,
} from '../src/watermark-utils'
import { revealWatermark } from '../src/reveal-watermark'

describe('Watermark', () => {
  afterEach(() => vi.restoreAllMocks())

  it('keeps visible mode as default and switches both layers reactively', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'Visible' },
      slots: { default: '<button>Interact</button>' },
    })
    expect(wrapper.findAll('.s-watermark__marks')).toHaveLength(1)
    expect(wrapper.find('.s-watermark__marks--blind').exists()).toBe(false)
    await wrapper.setProps({ mode: 'both', blindContent: 'SESSION-123' })
    expect(wrapper.findAll('.s-watermark__marks')).toHaveLength(2)
    const blind = wrapper.get('.s-watermark__marks--blind')
    expect(decodeURIComponent(blind.attributes('style')!)).toContain(
      'SESSION-123',
    )
    expect(blind.attributes('aria-hidden')).toBe('true')
    await wrapper.setProps({ mode: 'blind', blindContent: 'SESSION-456' })
    expect(wrapper.findAll('.s-watermark__marks')).toHaveLength(1)
    expect(decodeURIComponent(blind.attributes('style')!)).toContain(
      'SESSION-456',
    )
    expect(wrapper.get('button').text()).toBe('Interact')
    wrapper.unmount()
  })

  it('escapes untrusted text and supports multiline masks without injecting markup', () => {
    const mask = createWatermarkMask(
      '<image href="x"/>\n研发 & Design',
      16,
      48,
      -18,
    )
    const svg = decodeURIComponent(mask.image)
    expect(svg).not.toContain('<image')
    expect(svg).toContain('&lt;image')
    expect(svg).toContain('研发 &amp; Design')
    expect(svg.match(/<text /g)).toHaveLength(2)
    expect(
      createWatermarkMask('test', Number.NaN, Infinity, Number.NaN).size,
    ).not.toMatch(/NaN|Infinity/)
  })

  it('reveals tiny channel differences on light and dark neutral backgrounds', () => {
    // Simulate difference blending at strength 2 on white and gray backgrounds.
    const pixels = new Uint8ClampedArray([
      255, 255, 255, 255, 253, 255, 253, 255, 30, 30, 30, 255, 28, 30, 28, 255,
    ])
    const original = pixels.slice()
    const result = revealWatermarkPixels(pixels)
    expect(result[0]).toBe(128)
    expect(result[4]).toBe(192)
    expect(result[8]).toBe(128)
    expect(result[12]).toBe(192)
    expect(pixels).toEqual(original)
    expect(result[15]).toBe(255)
  })

  it('reveals screenshot pixels and releases the temporary image URL', async () => {
    const revoke = vi.fn()
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: revoke,
    })
    vi.stubGlobal(
      'Image',
      class {
        naturalWidth = 1
        naturalHeight = 1
        decode = () => Promise.resolve()
      },
    )
    const pixels = { data: new Uint8ClampedArray([253, 255, 253, 255]) }
    const context = {
      drawImage: vi.fn(),
      getImageData: () => pixels,
      putImageData: vi.fn(),
    }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as never,
    )
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/png;base64,result',
    )
    try {
      expect(await revealWatermark(new Blob())).toBe(
        'data:image/png;base64,result',
      )
      expect(pixels.data[0]).toBe(192)
      expect(context.putImageData).toHaveBeenCalled()
      expect(revoke).toHaveBeenCalledWith('blob:test')
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('releases the image URL when decoding fails', async () => {
    const revoke = vi.fn()
    vi.stubGlobal('URL', {
      createObjectURL: () => 'blob:invalid',
      revokeObjectURL: revoke,
    })
    vi.stubGlobal(
      'Image',
      class {
        decode = () => Promise.reject(new Error('invalid'))
      },
    )
    try {
      await expect(revealWatermark(new Blob())).rejects.toThrow('invalid')
      expect(revoke).toHaveBeenCalledWith('blob:invalid')
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
