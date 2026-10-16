import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import { SIcon } from '@vuesax-alpha/components/icon'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CatalogDropdown from '../../docs/.vuepress/theme/components/CatalogDropdown.vue'
import { enNavbar } from '../../docs/.vuepress/app/nav'
import type { NavbarGroup } from 'vuepress-vite'

vi.mock('@vuepress/client', () => ({
  usePageData: () => ({ value: { path: '/components/' } }),
}))
// Routing belongs to the unchanged NavLink component; exercise its real links
// in the browser and isolate the catalog's selection/focus behavior here.
vi.mock('../../docs/.vuepress/theme/components/NavLink.vue', async () => {
  const { h } = await import('vue')
  return {
    default: {
      props: ['navItem'],
      setup: (props: { navItem: { link: string; text: string } }) => () =>
        h(
          'a',
          { href: props.navItem.link, class: 'nav-link' },
          props.navItem.text,
        ),
    },
  }
})
beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
})
afterEach(() => {
  vi.unstubAllGlobals()
})

describe('documentation catalog dropdown', () => {
  it('renders its navigation trigger during server rendering', async () => {
    const app = createSSRApp(CatalogDropdown, {
      item: enNavbar[1] as NavbarGroup,
    })
    app.component('s-icon', SIcon)
    expect(await renderToString(app)).toContain('Documentation')
  })

  it('opens from the keyboard, switches categories, and restores focus on Escape', async () => {
    const wrapper = mount(CatalogDropdown, {
      attachTo: document.body,
      props: { item: enNavbar[1] as NavbarGroup },
      global: { components: { 's-icon': SIcon } },
    })
    try {
      const trigger = wrapper.get<HTMLButtonElement>('.docs-catalog-trigger')
      trigger.element.focus()
      await trigger.trigger('keydown', { key: 'ArrowDown' })
      await flushPromises()
      expect(document.activeElement?.textContent).toContain('General')
      await new Promise((resolve) => setTimeout(resolve, 220))
      expect(trigger.attributes('aria-expanded')).toBe('true')
      const panel = new DOMWrapper(
        document.querySelector<HTMLElement>('.docs-catalog')!,
      )
      const category = panel
        .findAll('button')
        .find((button) => button.text().includes('Data Entry'))!
      await category.trigger('click')
      expect(panel.get('h4').text()).toBe('Data Entry')
      expect(panel.findAll('.docs-catalog-links a')).toHaveLength(21)
      await category.trigger('keydown', { key: 'Escape' })
      await flushPromises()
      expect(trigger.attributes('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(trigger.element)
    } finally {
      wrapper.unmount()
    }
  })
})
