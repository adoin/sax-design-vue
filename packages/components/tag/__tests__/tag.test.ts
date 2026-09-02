import { createSSRApp, h } from 'vue'
import { mount } from '@vue/test-utils'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, it } from 'vitest'
import { STag } from '..'
import Tag from '../src/tag.vue'
import TagGroup from '../src/tag-group.vue'

describe('Tag', () => {
  it('keeps variant and shape as independent visual contracts', () => {
    const wrapper = mount(Tag, {
      props: { variant: 'outline', shape: 'square' },
      slots: { default: 'Square outline' },
      global: { stubs: { SIcon: true } },
    })

    expect(wrapper.classes()).toContain('is-style-outline')
    expect(wrapper.classes()).toContain('is-square')
  })

  it('supports semantic status and disabled interaction', async () => {
    const wrapper = mount(Tag, {
      props: { status: 'success', disabled: true, closable: true },
      slots: { default: 'Stable' },
      global: { stubs: { SIcon: true } },
    })

    expect(wrapper.classes()).toContain('s-tag--success')
    expect(wrapper.classes()).toContain('is-disabled')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('emits close without triggering the tag click handler', async () => {
    const wrapper = mount(Tag, {
      props: { closable: true },
      slots: { default: 'Closable' },
      global: { stubs: { SIcon: true } },
    })

    await wrapper.get('.s-tag__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('edits tag text inline without rendering a bordered control wrapper', async () => {
    const wrapper = mount(Tag, {
      props: { editable: true, text: 'Draft' },
      global: { stubs: { SIcon: true } },
    })

    const editor = wrapper.get('.s-tag__editor')
    await editor.setValue('Updated')
    await editor.trigger('keydown.enter')
    await editor.trigger('blur')

    expect(wrapper.classes()).toContain('is-editable')
    expect(wrapper.emitted('update:text')?.at(-1)).toEqual(['Updated'])
    expect(wrapper.emitted('edit-confirm')).toEqual([['Updated']])
  })

  it('restores the value from the start of an edit when Escape is pressed', async () => {
    const wrapper = mount(Tag, {
      props: { editable: true, text: 'Original' },
      global: { stubs: { SIcon: true } },
    })

    const editor = wrapper.get('.s-tag__editor')
    await editor.trigger('focus')
    await editor.setValue('Changed')
    await editor.trigger('keydown.esc')

    expect((editor.element as HTMLInputElement).value).toBe('Original')
    expect(wrapper.emitted('edit-cancel')).toHaveLength(1)
  })

  it('keeps tagStyle and round as compatibility aliases', () => {
    const wrapper = mount(Tag, {
      props: { tagStyle: 'mark', round: true },
      slots: { default: 'Legacy pill' },
      global: { stubs: { SIcon: true } },
    })

    expect(wrapper.classes()).toContain('is-style-mark')
    expect(wrapper.classes()).toContain('is-pill')
  })

  it('uses a compensated SVG shadow filter for clipped variants', () => {
    const wrapper = mount(Tag, {
      props: { variant: 'arrow' },
      slots: { default: 'Arrow' },
      global: { stubs: { SIcon: true } },
    })

    const filter = wrapper.get('filter')
    expect(filter.attributes('id')).toMatch(/^s-tag-shape-shadow-/)
    expect(wrapper.attributes('style')).toContain(
      `url("#${filter.attributes('id')}")`,
    )
    expect(wrapper.find('feMorphology').exists()).toBe(true)
    expect(wrapper.findAll('feGaussianBlur')).toHaveLength(2)
    expect(wrapper.find('.s-tag__shape-surface').exists()).toBe(true)
  })

  it('renders deterministic SVG filter references during SSR', async () => {
    const app = createSSRApp({
      render: () => h(Tag, { variant: 'flag' }, { default: () => 'SSR flag' }),
    })
    const html = await renderToString(app)

    expect(html).toContain('id="s-tag-shape-shadow-v-0"')
    expect(html).toContain('filter:url(&quot;#s-tag-shape-shadow-v-0&quot;)')
    expect(html).toContain('s-tag__shape-surface')
  })

  it('registers TagGroup when Tag is installed', () => {
    const names: string[] = []
    STag.install?.({
      component: (name: string) => names.push(name),
    } as never)

    expect(names).toEqual(['STag', 'STagGroup'])
  })

  it('renders and removes object values directly through TagGroup', async () => {
    const wrapper = mount(TagGroup, {
      props: {
        modelValue: [
          { id: 1, name: 'Vue' },
          { id: 2, name: 'Sax Design' },
        ],
        labelKey: 'name',
        valueKey: 'id',
      },
      global: { stubs: { SIcon: true } },
    })

    expect(wrapper.findAll('.s-tag')).toHaveLength(2)
    expect(wrapper.text()).toContain('Vue')

    await wrapper.findAll('.s-tag__close')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([
      [[{ id: 2, name: 'Sax Design' }]],
    ])
  })

  it('creates a borderless editable tag before adding an object value', async () => {
    const wrapper = mount(TagGroup, {
      props: {
        modelValue: [{ id: 1, name: 'Vue' }],
        labelKey: 'name',
        valueKey: 'id',
        createItem: (name: string) => ({ id: 2, name }),
      },
      global: { stubs: { SIcon: true } },
    })

    expect(wrapper.find('.s-tag-group__input').exists()).toBe(false)
    const addTrigger = wrapper.get('.s-tag-group__add')
    expect(addTrigger.element.tagName).toBe('SPAN')
    expect(addTrigger.attributes('role')).toBe('button')
    expect(addTrigger.attributes('tabindex')).toBe('0')
    await addTrigger.trigger('click')

    const editor = wrapper.get('.s-tag__editor')
    await editor.setValue('Sax Design')
    await editor.trigger('keydown.enter')

    expect(wrapper.emitted('update:modelValue')).toEqual([
      [
        [
          { id: 1, name: 'Vue' },
          { id: 2, name: 'Sax Design' },
        ],
      ],
    ])
  })
})
