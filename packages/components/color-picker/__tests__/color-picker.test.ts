import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ColorPicker from '../src/color-picker.vue'
import { formatColor, parseColor } from '../src/color-utils'

const PopperStub = defineComponent({
  name: 'SPopper',
  props: { visible: Boolean },
  emits: ['update:visible'],
  template: `
    <div class="popper-stub">
      <div class="popper-trigger-stub" @click="$emit('update:visible', !visible)"><slot /></div>
      <div v-if="visible" class="popper-content-stub"><slot name="content" /></div>
    </div>
  `,
})

const mountPicker = (props: Record<string, unknown> = {}) =>
  mount(ColorPicker, {
    props: {
      modelValue: 'rgba(86, 103, 244, 0.88)',
      showAlpha: true,
      ...props,
    },
    global: {
      stubs: {
        SPopper: PopperStub,
        SIcon: { template: '<i class="icon-stub" />' },
      },
    },
  })

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const mockNativeColorSelection = (color: string) =>
  vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(function (
    this: HTMLInputElement,
  ) {
    this.value = color
    this.dispatchEvent(new Event('input'))
  })

describe('ColorPicker', () => {
  it('opens the complete custom panel in one click without a native color input', async () => {
    const wrapper = mountPicker()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    await wrapper.get('.s-color-picker__trigger').trigger('click')

    expect(wrapper.get('[role="dialog"]').isVisible()).toBe(true)
    expect(wrapper.find('input[type="color"]').exists()).toBe(false)
    expect(wrapper.find('.s-color-picker__saturation').exists()).toBe(true)
  })

  it('switches between HEX, RGB(A), and HSL(A) editing and output', async () => {
    const wrapper = mountPicker({ format: 'hex' })
    await wrapper.get('.s-color-picker__trigger').trigger('click')

    const formatButtons = wrapper.findAll('.s-color-picker__format')
    await formatButtons[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'rgba(86, 103, 244, 0.88)',
    ])
    expect(wrapper.findAll('.s-color-picker__field')).toHaveLength(4)

    await formatButtons[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatch(/^hsla\(/)
    expect(wrapper.findAll('.s-color-picker__field')).toHaveLength(4)
  })

  it('updates an individual RGB channel and preserves alpha', async () => {
    const wrapper = mountPicker({ format: 'rgb' })
    await wrapper.get('.s-color-picker__trigger').trigger('click')

    await wrapper.findAll('.s-color-picker__field input')[0].setValue('120')
    await wrapper.findAll('.s-color-picker__field input')[0].trigger('change')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'rgba(120, 103, 244, 0.88)',
    ])
  })

  it('renders named presets and accepts HEX, RGBA, and HSLA values', async () => {
    const wrapper = mountPicker({
      format: 'rgb',
      predefine: [
        { name: 'Brand', value: '#112233' },
        { name: 'Overlay', value: 'rgba(10, 20, 30, 0.4)' },
        { name: 'Success', value: 'hsla(120, 100%, 50%, 0.25)' },
      ],
    })
    await wrapper.get('.s-color-picker__trigger').trigger('click')

    const presets = wrapper.findAll('.s-color-picker__preset')
    expect(presets.map((preset) => preset.text())).toEqual([
      'Brand',
      'Overlay',
      'Success',
    ])

    await presets[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'rgba(17, 34, 51, 1)',
    ])
    await presets[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'rgba(10, 20, 30, 0.4)',
    ])
    await presets[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'rgba(0, 255, 0, 0.25)',
    ])
  })

  it('keeps string presets compatible and ignores invalid values', async () => {
    const wrapper = mountPicker({
      predefine: ['#ABCDEF', 'not-a-color'],
    })
    await wrapper.get('.s-color-picker__trigger').trigger('click')

    const presets = wrapper.findAll('.s-color-picker__preset')
    expect(presets).toHaveLength(1)
    expect(presets[0].text()).toBe('#ABCDEF')
  })

  it('uses EyeDropper directly and keeps the current opacity', async () => {
    const open = vi.fn().mockResolvedValue({ sRGBHex: '#12AB34' })
    vi.stubGlobal(
      'EyeDropper',
      class {
        open = open
      },
    )
    const wrapper = mountPicker({ format: 'rgb' })
    await wrapper.get('.s-color-picker__trigger').trigger('click')

    await wrapper
      .get('[aria-label="Pick a color from the screen"]')
      .trigger('click')
    await flushPromises()

    expect(open).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'rgba(18, 171, 52, 0.88)',
    ])
  })

  it('falls back to the native color API when EyeDropper is unsupported', async () => {
    const nativeClick = mockNativeColorSelection('#224466')
    const wrapper = mountPicker({ format: 'rgb' })
    await wrapper.get('.s-color-picker__trigger').trigger('click')
    await wrapper
      .get('[aria-label="Pick a color from the screen"]')
      .trigger('click')
    await flushPromises()

    expect(nativeClick).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'rgba(34, 68, 102, 0.88)',
    ])
    expect(document.querySelector('[data-s-color-picker-fallback]')).toBeNull()
  })

  it('uses the native fallback after an EyeDropper failure', async () => {
    const open = vi.fn().mockRejectedValue(new Error('EyeDropper failed'))
    vi.stubGlobal(
      'EyeDropper',
      class {
        open = open
      },
    )
    const nativeClick = mockNativeColorSelection('#AABBCC')
    const wrapper = mountPicker({ format: 'rgb' })
    await wrapper.get('.s-color-picker__trigger').trigger('click')
    await wrapper
      .get('[aria-label="Pick a color from the screen"]')
      .trigger('click')
    await flushPromises()

    expect(open).toHaveBeenCalledTimes(1)
    expect(nativeClick).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([
      'rgba(170, 187, 204, 0.88)',
    ])
  })

  it('does not open the fallback after the user cancels EyeDropper', async () => {
    const open = vi
      .fn()
      .mockRejectedValue(new DOMException('Cancelled', 'AbortError'))
    vi.stubGlobal(
      'EyeDropper',
      class {
        open = open
      },
    )
    const nativeClick = vi.spyOn(HTMLInputElement.prototype, 'click')
    const wrapper = mountPicker()
    await wrapper.get('.s-color-picker__trigger').trigger('click')
    await wrapper
      .get('[aria-label="Pick a color from the screen"]')
      .trigger('click')
    await flushPromises()

    expect(nativeClick).not.toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('color format utilities', () => {
  it('parses and formats alpha colors across supported formats', () => {
    const color = parseColor('hsla(228, 88%, 65%, 0.5)')

    expect(color).toBeDefined()
    expect(formatColor(color!, 'hex', true)).toMatch(/^#[\dA-F]{8}$/)
    expect(formatColor(color!, 'rgb', true)).toMatch(/^rgba\(/)
    expect(formatColor(color!, 'hsl', true)).toMatch(/^hsla\(/)
  })
})
