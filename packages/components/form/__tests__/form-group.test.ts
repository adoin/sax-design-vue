import { defineComponent, h, nextTick, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import FormGroup from '../src/form-group.vue'
import type { FormGroupInstance, FormGroupItem } from '../src/form-group'

const TestInput = defineComponent({
  name: 'TestInput',
  props: { modelValue: String, id: String },
  emits: ['update:modelValue'],
  template:
    '<input :id="id" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
})

interface Project {
  name?: string
}

const mountGroup = (
  initial: FormGroupItem<Project>[],
  overrides: Record<string, unknown> = {},
) => {
  const items = ref(initial)
  const group = ref<FormGroupInstance>()
  const Host = defineComponent({
    setup() {
      return () =>
        h(
          FormGroup,
          {
            ref: group,
            modelValue: items.value,
            'onUpdate:modelValue': (value: FormGroupItem<Project>[]) => {
              items.value = value
            },
            tabLabel: 'Project',
            getFormSetting: () => ({
              items: [
                {
                  field: 'name',
                  title: 'Name',
                  rules: { required: true, message: 'Name is required' },
                  itemRender: { name: 'TestInput' },
                },
              ],
            }),
            ...overrides,
          },
          {},
        )
    },
  })

  const wrapper = mount(Host, {
    global: {
      components: { TestInput },
      stubs: {
        SPopper: { template: '<div><slot /><slot name="content" /></div>' },
      },
    },
  })

  return { wrapper, items, group }
}

describe('FormGroup', () => {
  it('normalizes stable indexes and uses tabs to add and remove forms', async () => {
    const createItem = vi.fn(() => ({ name: 'New project' }))
    const onAdd = vi.fn()
    const { wrapper, items, group } = mountGroup(
      [{ name: 'Alpha' }, { name: 'Beta', __index: 0 }],
      { editable: true, showAdd: true, createItem, onAdd },
    )
    await flushPromises()

    expect(items.value.map((item) => item.__index)).toEqual([1, 0])
    expect(new Set(items.value.map((item) => item.__index)).size).toBe(2)
    expect(wrapper.findAll('.s-form')).toHaveLength(2)
    expect(wrapper.get('.s-tabs').classes()).toContain(
      's-tabs--type-connected-card',
    )

    await wrapper.get('.s-tabs__action').trigger('click')
    await flushPromises()

    expect(createItem).toHaveBeenCalledOnce()
    expect(items.value).toHaveLength(3)
    expect(items.value[2]).toMatchObject({ name: 'New project', __index: 2 })
    expect(group.value?.activeKey).toBe(2)
    expect(onAdd).toHaveBeenCalledWith(items.value[2], 2)

    group.value?.removeItem(1)
    await nextTick()

    expect(items.value.map((item) => item.__index)).toEqual([0, 2])
    expect(wrapper.findAll('.s-form')).toHaveLength(2)
  })

  it('allows the tabs appearance to change without losing edit controls', async () => {
    const { wrapper } = mountGroup([{ name: 'Alpha' }], {
      tabsType: 'pill',
      editable: true,
      showAdd: true,
      createItem: () => ({ name: 'Beta' }),
    })
    await flushPromises()

    expect(wrapper.get('.s-tabs').classes()).toContain('s-tabs--type-pill')
    expect(wrapper.find('.s-tabs__action').exists()).toBe(true)
    expect(wrapper.find('.s-tabs__close').exists()).toBe(true)
  })

  it('validates every form, marks the invalid tab, and focuses it', async () => {
    const { wrapper, items, group } = mountGroup([
      { name: 'Ready', __index: 4 },
      { name: '', __index: 9 },
    ])
    await flushPromises()

    expect(await group.value?.validateAll()).toBe(false)
    await nextTick()

    expect(group.value?.activeKey).toBe(9)
    expect(group.value?.errorIndexes).toEqual([9])
    expect(
      wrapper.get('.s-form-group__error-mark').attributes('aria-label'),
    ).toBe('Validation error')
    expect(wrapper.get('[role="tab"][aria-selected="true"]').text()).toContain(
      'Project 10',
    )

    items.value[1].name = 'Fixed'
    await nextTick()

    expect(await group.value?.validateAll()).toBe(true)
    expect(group.value?.errorIndexes).toEqual([])
    expect(wrapper.find('.s-form-group__error-mark').exists()).toBe(false)
  })

  it('can create the first form from the empty state', async () => {
    const { wrapper, items } = mountGroup([], {
      showAdd: true,
      createItem: async () => ({ name: 'First' }),
      emptyText: 'Nothing here',
    })

    expect(wrapper.get('.s-form-group__empty').text()).toContain('Nothing here')
    await wrapper.get('.s-form-group__empty-add').trigger('click')
    await flushPromises()

    expect(items.value).toEqual([{ name: 'First', __index: 0 }])
    expect(wrapper.find('.s-tabs').exists()).toBe(true)
  })

  it('provides item context for right-click menus and follows external data cleanup', async () => {
    const onTabContextmenu = vi.fn()
    const onContextMenuSelect = vi.fn()
    const { wrapper, items } = mountGroup(
      [
        { name: 'Alpha', __index: 3 },
        { name: 'Beta', __index: 7 },
        { name: 'Gamma', __index: 11 },
      ],
      {
        getContextMenuItems: ({ index }: { index: number }) => [
          { label: `Close ${index}`, value: 'close' },
        ],
        onTabContextmenu,
        onContextMenuSelect,
      },
    )
    await flushPromises()

    const triggers = wrapper.findAll('.s-context-menu')
    expect(triggers).toHaveLength(3)
    await triggers[1].trigger('contextmenu', { clientX: 24, clientY: 32 })
    await flushPromises()

    expect(onTabContextmenu).toHaveBeenCalledOnce()
    const [context, event] = onTabContextmenu.mock.calls[0]
    expect(context).toMatchObject({
      item: items.value[1],
      index: 1,
      key: 7,
      list: items.value,
    })
    expect(event).toBeInstanceOf(MouseEvent)

    const menuItem = document.body.querySelector(
      '.s-context-menu__item',
    ) as HTMLButtonElement
    menuItem.click()
    await flushPromises()

    expect(onContextMenuSelect).toHaveBeenCalledOnce()
    expect(onContextMenuSelect.mock.calls[0][0]).toMatchObject({
      label: 'Close 1',
      value: 'close',
    })
    expect(onContextMenuSelect.mock.calls[0][1]).toMatchObject({
      index: 1,
      key: 7,
    })

    items.value = items.value.filter((_, index) => index !== 1)
    await flushPromises()
    await nextTick()

    expect(items.value.map((item) => item.__index)).toEqual([3, 11])
    await vi.waitFor(() =>
      expect(wrapper.findAll('[role="tab"]')).toHaveLength(2),
    )
  })

  it('lazily mounts large groups and validates unmounted forms headlessly', async () => {
    const { wrapper, group } = mountGroup(
      [
        { name: 'Ready', __index: 4 },
        { name: '', __index: 9 },
        { name: 'Also ready', __index: 12 },
      ],
      { renderThreshold: 1 },
    )
    await flushPromises()

    expect(wrapper.findAll('.s-form')).toHaveLength(1)
    expect(group.value?.getForm(9)).toBeUndefined()

    expect(await group.value?.validateFields(9, ['name'])).toBe(false)
    expect(group.value?.getErrors(9)).toEqual({ name: 'Name is required' })
    expect(wrapper.findAll('.s-form')).toHaveLength(1)

    expect(await group.value?.validateAll()).toBe(false)
    await nextTick()

    expect(group.value?.activeKey).toBe(9)
    expect(group.value?.errorIndexes).toEqual([9])
    expect(wrapper.findAll('.s-form')).toHaveLength(2)
  })

  it('finds item twenty when validating a 25-item lazy group', async () => {
    const { wrapper, group } = mountGroup(
      Array.from({ length: 25 }, (_, index) => ({
        name: index === 19 ? '' : `Project ${index + 1}`,
        __index: index,
      })),
      { renderThreshold: 5 },
    )
    await flushPromises()

    expect(wrapper.findAll('.s-form')).toHaveLength(1)
    const labels = wrapper.findAll('[role="tab"]').map((tab) => tab.text())
    expect(labels[0]).toContain('Project 1')
    expect(labels[labels.length - 1]).toContain('Project 25')

    expect(await group.value?.validateAll()).toBe(false)
    await nextTick()

    expect(group.value?.activeKey).toBe(19)
    expect(group.value?.errorIndexes).toEqual([19])
    expect(group.value?.getErrors(19)).toEqual({ name: 'Name is required' })
    expect(wrapper.findAll('.s-form')).toHaveLength(2)
    expect(wrapper.get('.s-form-item.is-error').text()).toContain(
      'Name is required',
    )
  })
})
