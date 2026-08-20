import { h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Radio from '../src/radio.vue'
import RadioGroup from '../src/radio-group.vue'
import RadioGroupTabs from '../src/radio-group-tabs.vue'

const options = [
  { label: 'Starter', value: 'starter', description: 'For personal use' },
  { label: 'Team', value: 'team', description: 'For small teams' },
  { label: 'Enterprise', value: 'enterprise', disabled: true },
]

describe('RadioGroup', () => {
  it('renders data-driven options and emits the selected value', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'starter',
        options,
        columns: 3,
      },
    })

    expect(wrapper.findAllComponents(Radio)).toHaveLength(3)
    expect(wrapper.text()).toContain('For small teams')
    expect(wrapper.findAll('input')[0].element.checked).toBe(true)
    expect(wrapper.findAll('input')[2].attributes()).toHaveProperty('disabled')

    await wrapper.findAll('input')[1].setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['team'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['team'])
  })

  it('provides one model and native name to manually composed radios', async () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'starter' },
      slots: {
        default: () => [
          h(Radio, { value: 'starter' }, () => 'Starter'),
          h(Radio, { value: 'team' }, () => 'Team'),
        ],
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs[0].element.checked).toBe(true)
    expect(inputs[0].attributes('name')).toBe(inputs[1].attributes('name'))
    expect(inputs[0].attributes('name')).toBeTruthy()

    await inputs[1].setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['team'])
  })

  it('renders the button presentation with readable option labels', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'starter',
        options,
        type: 'button',
      },
    })

    const buttons = wrapper.findAll('.s-radio-button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0].classes()).toContain('is-active')
    expect(buttons[0].text()).toContain('Starter')
    expect(buttons[0].find('.s-radio-button__indicator').exists()).toBe(true)

    await buttons[1].get('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['team'])
  })
})

describe('RadioGroupTabs', () => {
  const tabs = [
    {
      label: 'Workspace',
      value: 'workspace',
      options: [
        { label: 'Starter', value: 'starter' },
        { label: 'Team', value: 'team' },
      ],
    },
    {
      label: 'Disabled',
      value: 'disabled',
      disabled: true,
      options: [{ label: 'Unavailable', value: 'unavailable' }],
    },
    {
      label: 'Notifications',
      value: 'notifications',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Mentions', value: 'mentions' },
      ],
    },
  ]

  it('switches panels without changing their saved selections', async () => {
    const wrapper = mount(RadioGroupTabs, {
      props: {
        modelValue: { workspace: 'starter', notifications: 'mentions' },
        tabs,
      },
    })

    expect(wrapper.get('[role="tabpanel"]').text()).toContain('Starter')
    expect(wrapper.findAll('.s-radio-group-tabs__value')[0].text()).toBe(
      'Starter',
    )

    await wrapper.findAll('[role="tab"]')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('update:activeKey')?.at(-1)?.[0]).toBe(
      'notifications',
    )
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('Mentions')
    expect(wrapper.get('input:checked').attributes('value')).toBe('mentions')
  })

  it('updates only the active tab value', async () => {
    const wrapper = mount(RadioGroupTabs, {
      props: {
        modelValue: { workspace: 'starter', notifications: 'mentions' },
        tabs,
      },
    })

    await wrapper.findAll('input[type="radio"]')[1].setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual({
      workspace: 'team',
      notifications: 'mentions',
    })
    expect(wrapper.emitted('change')?.[0]).toEqual([
      { workspace: 'team', notifications: 'mentions' },
      'workspace',
    ])
  })

  it('skips disabled tabs during keyboard navigation', async () => {
    const wrapper = mount(RadioGroupTabs, {
      attachTo: document.body,
      props: {
        modelValue: { workspace: 'starter', notifications: 'mentions' },
        tabs,
      },
    })

    await wrapper.findAll('[role="tab"]')[0].trigger('keydown', {
      key: 'ArrowRight',
    })
    await nextTick()

    expect(wrapper.emitted('update:activeKey')?.at(-1)?.[0]).toBe(
      'notifications',
    )
    expect(document.activeElement?.textContent).toContain('Notifications')
    wrapper.unmount()
  })
})
