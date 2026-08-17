import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CheckboxGroup from '../src/checkbox-group.vue'
import CheckboxGroupTabs from '../src/checkbox-group-tabs.vue'

const sections = [
  {
    label: 'Feeds',
    value: 'feeds',
    options: [
      { label: 'Main feed', value: 'feed' },
      { label: 'Profile feed', value: 'profile' },
    ],
  },
]

describe('CheckboxGroup', () => {
  it('renders an indeterminate section and selects all enabled children', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: ['feed'],
        options: sections,
        columns: 2,
      },
    })

    const checkboxes = wrapper.findAllComponents({ name: 'SCheckbox' })
    expect(checkboxes).toHaveLength(3)
    expect(checkboxes[0].props('indeterminate')).toBe(true)
    const sectionInput = wrapper.get(
      '.s-checkbox-group__section-header input[type="checkbox"]',
    ).element as HTMLInputElement
    expect(sectionInput.indeterminate).toBe(true)
    expect(sectionInput.getAttribute('aria-checked')).toBe('mixed')

    await wrapper
      .get('.s-checkbox-group__section-header input[type="checkbox"]')
      .setValue(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([
      'feed',
      'profile',
    ])
  })

  it('preserves disabled values during a section selection', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: {
        modelValue: ['feed'],
        options: sections,
        disabledValues: ['feed'],
      },
    })

    await wrapper
      .get('.s-checkbox-group__section-header input[type="checkbox"]')
      .setValue(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([
      'feed',
      'profile',
    ])
  })
})

describe('CheckboxGroupTabs', () => {
  const tabs = [
    {
      label: 'Facebook',
      value: 'facebook',
      options: sections,
    },
    {
      label: 'Instagram',
      value: 'instagram',
      options: [
        {
          label: 'Stories',
          value: 'stories',
          options: [
            { label: 'Story', value: 'story' },
            { label: 'Reels', value: 'reels' },
          ],
        },
      ],
    },
  ]

  it('switches tabs without changing selection', async () => {
    const wrapper = mount(CheckboxGroupTabs, {
      props: {
        modelValue: { facebook: ['feed'], instagram: [] },
        tabs,
      },
    })

    await wrapper.findAll('[role="tab"]')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('update:activeKey')?.at(-1)?.[0]).toBe('instagram')
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('Story')
  })

  it('selects all values from a tab checkbox and activates its panel', async () => {
    const wrapper = mount(CheckboxGroupTabs, {
      props: {
        modelValue: { facebook: ['feed'], instagram: [] },
        tabs,
      },
    })

    const tabCheckboxes = wrapper.findAll(
      '.s-checkbox-group-tabs__tab input[type="checkbox"]',
    )
    await tabCheckboxes[1].setValue(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual({
      facebook: ['feed'],
      instagram: ['story', 'reels'],
    })
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('Reels')
  })

  it('supports arrow-key tab navigation', async () => {
    const wrapper = mount(CheckboxGroupTabs, {
      attachTo: document.body,
      props: {
        modelValue: { facebook: [], instagram: [] },
        tabs,
      },
    })

    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', {
      key: 'ArrowRight',
    })
    await nextTick()

    expect(wrapper.emitted('update:activeKey')?.at(-1)?.[0]).toBe('instagram')
    expect(document.activeElement?.textContent).toContain('Instagram')
    wrapper.unmount()
  })
})
