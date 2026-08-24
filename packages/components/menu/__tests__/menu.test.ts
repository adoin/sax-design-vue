import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import Menu from '../src/menu.vue'
import { createMenuTreeIndex } from '../src/menu'

import type { MenuOption } from '../src/menu'

const options: MenuOption[] = [
  {
    key: 'workspace',
    label: 'Workspace',
    children: [
      { key: 'overview', label: 'Overview' },
      {
        key: 'projects',
        label: 'Projects',
        children: [{ key: 'active', label: 'Active projects' }],
      },
    ],
  },
  {
    key: 'team',
    label: 'Team',
    children: [{ key: 'members', label: 'Members' }],
  },
]

class IntersectionObserverMock {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
})

describe('Menu', () => {
  it('indexes ancestors, descendants, and same-level siblings', () => {
    const index = createMenuTreeIndex(options)

    expect(index.ancestors.get('active')).toEqual(['workspace', 'projects'])
    expect(index.descendants.get('workspace')).toEqual([
      'overview',
      'projects',
      'active',
    ])
    expect(index.siblings.get('workspace')).toEqual(['workspace', 'team'])
  })

  it('animates inline branches and reports open state', async () => {
    const wrapper = mount(Menu, { props: { options } })
    const control = wrapper.find('button')

    expect(control.attributes('aria-expanded')).toBe('false')
    await control.trigger('click')

    expect(control.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('.s-menu-node__children-motion').exists()).toBe(true)
    expect(wrapper.emitted('update:openKeys')?.[0]).toEqual([['workspace']])
    expect(wrapper.emitted('open')?.[0]).toEqual(['workspace'])
  })

  it('keeps openKeys controlled until the parent updates it', async () => {
    const wrapper = mount(Menu, {
      props: { options, openKeys: ['workspace'] },
    })
    const control = wrapper.find('button')

    await control.trigger('click')
    expect(wrapper.emitted('update:openKeys')?.[0]).toEqual([[]])
    expect(control.attributes('aria-expanded')).toBe('true')

    await wrapper.setProps({ openKeys: [] })
    expect(control.attributes('aria-expanded')).toBe('false')
  })

  it('closes sibling branches when uniqueOpen is enabled', async () => {
    const wrapper = mount(Menu, { props: { options, uniqueOpen: true } })
    const controls = wrapper.findAll('button')

    await controls[0].trigger('click')
    await controls[1].trigger('click')

    expect(wrapper.emitted('update:openKeys')?.at(-1)).toEqual([['team']])
  })

  it('supports click-triggered popup branches at multiple levels', async () => {
    const wrapper = mount(Menu, {
      attachTo: document.body,
      props: {
        options,
        submenuMode: 'popup',
        trigger: 'click',
        teleported: false,
        showDelay: 0,
        hideDelay: 0,
      },
    })

    await wrapper.find('button').trigger('click')
    await vi.waitFor(() => {
      expect(
        (wrapper.find('.s-menu-popup').element as HTMLElement).style.display,
      ).not.toBe('none')
    })

    expect(wrapper.find('button').attributes('aria-haspopup')).toBe('true')

    const projectControl = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Projects'))
    expect(projectControl).toBeDefined()
    await projectControl!.trigger('click')
    await vi.waitFor(() => {
      expect(
        wrapper
          .findAll('.s-menu-popup')
          .filter(
            (item) => (item.element as HTMLElement).style.display !== 'none',
          ),
      ).toHaveLength(2)
    })

    const leaf = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Active projects'))
    await leaf!.trigger('keydown', { key: 'Escape' })
    await vi.waitFor(() => {
      expect(projectControl!.attributes('aria-expanded')).toBe('false')
    })
    await vi.waitFor(() => {
      expect(document.activeElement).toBe(projectControl!.element)
    })
    wrapper.unmount()
  })

  it('opens and closes popup branches on hover', async () => {
    const wrapper = mount(Menu, {
      props: {
        options,
        submenuMode: 'popup',
        trigger: 'hover',
        teleported: false,
        showDelay: 0,
        hideDelay: 0,
      },
    })
    const control = wrapper.find('button')

    await control.trigger('mouseenter')
    await vi.waitFor(() => {
      expect(control.attributes('aria-expanded')).toBe('true')
    })

    await control.trigger('mouseleave')
    await vi.waitFor(() => {
      expect(control.attributes('aria-expanded')).toBe('false')
    })
  })

  it('uses a downward root cue and a dedicated horizontal panel', async () => {
    const wrapper = mount(Menu, {
      props: {
        options,
        mode: 'horizontal',
        trigger: 'click',
        teleported: false,
        showDelay: 0,
        hideDelay: 0,
      },
    })
    const rootControl = wrapper.findComponent({ name: 'SMenuNodeControl' })

    expect(rootControl.props('horizontalRoot')).toBe(true)
    expect(rootControl.findComponent({ name: 'SIcon' }).props('name')).toBe(
      'cb:chevron-down',
    )

    await rootControl.find('button').trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.find('.s-menu-popup--horizontal-root').exists()).toBe(true)
    })

    expect(wrapper.find('.s-menu-popup-panel__lead').text()).toContain(
      'Workspace',
    )

    const projectControl = wrapper
      .findAllComponents({ name: 'SMenuNodeControl' })
      .find((control) => control.text().includes('Projects'))
    expect(projectControl?.props('horizontalRoot')).toBe(false)
    expect(projectControl?.findComponent({ name: 'SIcon' }).props('name')).toBe(
      'cb:chevron-right',
    )
    wrapper.unmount()
  })

  it('renders groups, dividers, descriptions, badges, and links', () => {
    const wrapper = mount(Menu, {
      props: {
        options: [
          {
            key: 'group',
            label: 'Management',
            type: 'group',
            children: [
              {
                key: 'reports',
                label: 'Reports',
                description: 'Weekly overview',
                badge: 3,
                href: '/reports',
              },
            ],
          },
          { key: 'divider', label: '', type: 'divider' },
        ],
      },
    })

    expect(wrapper.find('.s-menu-node__group-label').text()).toBe('Management')
    expect(wrapper.find('.s-menu-node__description').text()).toBe(
      'Weekly overview',
    )
    expect(wrapper.find('.s-menu-node__badge').text()).toBe('3')
    expect(wrapper.find('a').attributes('href')).toBe('/reports')
    expect(wrapper.find('.s-menu-node.is-divider').exists()).toBe(true)
  })

  it('uses repository tooltips for collapsed leaf labels', () => {
    const wrapper = mount(Menu, {
      props: {
        collapse: true,
        options: [
          { key: 'overview', label: 'Overview', icon: 'cb:home' },
          ...options,
        ],
      },
    })
    const tooltip = wrapper.findComponent({ name: 'STooltip' })

    expect(tooltip.exists()).toBe(true)
    expect(tooltip.props('disabled')).toBe(false)
    expect(tooltip.text()).toContain('Overview')
  })
})
