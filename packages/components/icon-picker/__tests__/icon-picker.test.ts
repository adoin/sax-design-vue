import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { addIconData } from 'sax-design-vue-iconify'
import { zhCn } from '@vuesax-alpha/locale'
import IconPickerPanel from '../src/icon-picker-panel.vue'
import iconPicker from '../src/icon-picker-service'
import {
  DEFAULT_ICON_LIST,
  createIconSvg,
  normalizeIconList,
} from '../src/icon-picker'

const iconData = {
  body: '<path fill="currentColor" d="M2 2h12v12H2z"/>',
  attributes: { viewBox: '0 0 16 16' },
}
const missingIcon = ['bx', 'missing'].join(':')

beforeAll(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  addIconData('cb:home', iconData)
  addIconData('cb:search', iconData)
  DEFAULT_ICON_LIST.forEach((name) => addIconData(name, iconData))
})

afterAll(() => vi.unstubAllGlobals())

afterEach(() => {
  document.body.innerHTML = ''
})

describe('IconPicker', () => {
  it('ships a broad, unique default Carbon collection', () => {
    expect(DEFAULT_ICON_LIST).toHaveLength(168)
    expect(new Set(DEFAULT_ICON_LIST).size).toBe(DEFAULT_ICON_LIST.length)
  })

  it('normalizes registered names and ignores unavailable values', () => {
    expect(
      normalizeIconList(['cb:home', ' cb:search ', 'cb:home', missingIcon]),
    ).toEqual(['cb:home', 'cb:search'])
  })

  it('creates standalone, colored SVG code', () => {
    const svg = createIconSvg({
      name: 'cb:home',
      color: '#12AABB',
      size: 28,
      label: 'Home',
    })

    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain('width="28"')
    expect(svg).toContain('height="28"')
    expect(svg).toContain('fill="#12AABB"')
    expect(svg).toContain('role="img"')
    expect(svg).toContain('aria-label="Home"')
    expect(svg).not.toContain('currentColor')
  })

  it('returns undefined for unavailable icons or invalid colors', () => {
    expect(createIconSvg({ name: missingIcon, color: '#000' })).toBeUndefined()
    expect(
      createIconSvg({ name: 'cb:home', color: 'url(javascript:alert(1))' }),
    ).toBeUndefined()
  })

  it('searches and selects icons in the dialog panel', async () => {
    const wrapper = mount(IconPickerPanel, {
      props: {
        iconList: ['cb:home', 'cb:search'],
        modelValue: '',
        color: '#5667F4',
        showName: true,
      },
      global: {
        stubs: {
          SIcon: {
            props: ['name'],
            template: '<i class="icon-stub" :data-name="name" />',
          },
        },
      },
    })

    expect(wrapper.findAll('[role="option"]')).toHaveLength(2)
    await wrapper.get('input[type="search"]').setValue('search')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
    await wrapper.get('[role="option"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['cb:search'])
  })

  it('opens programmatically and resolves the generated SVG', async () => {
    const pending = iconPicker({
      locale: zhCn,
      iconList: ['cb:home'],
      color: '#334455',
      size: 32,
    })

    await nextTick()
    const option = document.querySelector<HTMLButtonElement>(
      '[role="option"][aria-label="cb:home"]',
    )
    expect(option).not.toBeNull()
    expect(document.body.textContent).toContain('选择图标和颜色')
    expect(document.body.textContent).toContain('插入 SVG')
    option?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))

    const svg = await pending
    expect(svg).toContain('width="32"')
    expect(svg).toContain('fill="#334455"')
    expect(document.querySelector('.s-icon-picker__body')).toBeNull()
  })
})
