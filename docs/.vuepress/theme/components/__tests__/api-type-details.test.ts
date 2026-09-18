import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ApiTypeDetails from '../ApiTypeDetails.vue'

const labels = {
  openTypeDetails: 'Show full type details',
  closeTypeDetails: 'Hide full type details',
  typeDetailsTitle: 'Type details',
  currentType: 'Current type',
  referencedTypes: 'Referenced type definitions',
  noReferencedTypes: 'No local referenced type definitions.',
  source: 'Source',
}

const definitions = {
  TableClipboardConfig: {
    name: 'TableClipboardConfig',
    declaration:
      'export interface TableClipboardConfig {\n  write?: TableClipboardWriteConfig\n  paste?: TableClipboardWriteConfig\n}',
    source: 'packages/components/table/src/table.ts',
    references: ['TableClipboardWriteConfig'],
  },
  TableClipboardWriteConfig: {
    name: 'TableClipboardWriteConfig',
    declaration:
      'export interface TableClipboardWriteConfig {\n  enabled?: boolean\n  policy?: TableClipboardPolicy\n}',
    source: 'packages/components/table/src/table.ts',
    references: ['TableClipboardPolicy'],
  },
  TableClipboardPolicy: {
    name: 'TableClipboardPolicy',
    declaration: "export type TableClipboardPolicy = 'strict' | 'permissive'",
    source: 'packages/components/table/src/table.ts',
    references: [],
  },
}

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
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('ApiTypeDetails', () => {
  it('highlights the complete expression and only makes resolved references interactive', () => {
    const wrapper = mount(ApiTypeDetails, {
      attachTo: document.body,
      props: {
        type: 'Boolean | TableClipboardConfig',
        definitions,
        labels,
      },
    })

    expect(wrapper.findAll('.api-type-reference')).toHaveLength(1)
    expect(wrapper.get('.api-type-code').attributes()).toHaveProperty(
      'data-no-inline-code-copy',
    )
    expect(wrapper.get('.is-primitive').text()).toBe('Boolean')
    expect(wrapper.get('.is-operator').text()).toBe('|')
    expect(wrapper.get('.api-type-reference').element.tagName).toBe('BUTTON')
    expect(wrapper.findAll('.is-space')[1].element.textContent).toBe('\u00A0')

    wrapper.unmount()
  })

  it('opens one referenced declaration at a time and retains its ancestor layer', async () => {
    const wrapper = mount(ApiTypeDetails, {
      attachTo: document.body,
      props: {
        type: 'Boolean | TableClipboardConfig',
        definitions,
        labels,
      },
    })

    const rootReferences = wrapper.findAll('.api-type-reference')
    expect(rootReferences).toHaveLength(1)
    expect(rootReferences[0].text()).toBe('TableClipboardConfig')
    expect(
      wrapper.get('.api-type-expression').text().replaceAll('\u00A0', ' '),
    ).toContain('Boolean | TableClipboardConfig')

    await rootReferences[0].trigger('click')
    await flushPromises()

    let layers = document.body.querySelectorAll('.api-type-definition')
    expect(layers).toHaveLength(1)
    expect(layers[0].textContent).toContain('TableClipboardConfig')
    expect(layers[0].textContent).not.toContain(
      'export interface TableClipboardWriteConfig',
    )

    const nestedReference = layers[0].querySelector<HTMLButtonElement>(
      '.api-type-reference',
    )
    expect(nestedReference?.textContent).toBe('TableClipboardWriteConfig')
    nestedReference?.click()
    await flushPromises()

    layers = document.body.querySelectorAll('.api-type-definition')
    expect(layers).toHaveLength(2)
    expect(layers[0].textContent).toContain('TableClipboardConfig')
    expect(layers[1].textContent).toContain('TableClipboardWriteConfig')
    expect(
      layers[0].querySelectorAll('.api-type-reference[aria-expanded="true"]'),
    ).toHaveLength(1)

    layers[1].querySelector<HTMLButtonElement>('.api-type-reference')!.click()
    await flushPromises()
    layers = document.body.querySelectorAll('.api-type-definition')
    expect(layers).toHaveLength(3)
    expect(layers[0].textContent).toContain('TableClipboardConfig')
    expect(layers[1].textContent).toContain('TableClipboardWriteConfig')
    expect(layers[2].textContent).toContain('TableClipboardPolicy')

    const firstLayerCode = layers[0].querySelector('.api-type-definition__code')
    expect(firstLayerCode?.textContent).toContain(
      'write?: TableClipboardWriteConfig',
    )
    expect(firstLayerCode?.querySelector('.is-keyword')?.textContent).toBe(
      'export',
    )

    layers[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()
    expect(document.body.querySelectorAll('.api-type-definition')).toHaveLength(
      3,
    )
    await new Promise((resolve) => setTimeout(resolve, 0))

    const outside = document.createElement('button')
    document.body.append(outside)
    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await flushPromises()
    await vi.waitFor(() =>
      expect(
        document.body.querySelectorAll('.api-type-definition'),
      ).toHaveLength(0),
    )

    wrapper.unmount()
  })

  it('replaces only the branch above an ancestor layer', async () => {
    const branchDefinitions = {
      RootConfig: {
        name: 'RootConfig',
        declaration:
          'export interface RootConfig {\n  first?: FirstConfig\n  second?: SecondConfig\n}',
        source: 'root.ts',
        references: ['FirstConfig', 'SecondConfig'],
      },
      FirstConfig: {
        name: 'FirstConfig',
        declaration: 'export interface FirstConfig { first?: boolean }',
        source: 'first.ts',
        references: [],
      },
      SecondConfig: {
        name: 'SecondConfig',
        declaration: 'export interface SecondConfig { second?: boolean }',
        source: 'second.ts',
        references: [],
      },
    }
    const wrapper = mount(ApiTypeDetails, {
      attachTo: document.body,
      props: {
        type: 'RootConfig',
        definitions: branchDefinitions,
        labels,
      },
    })

    await wrapper.get('.api-type-reference').trigger('click')
    await flushPromises()
    const firstReference = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>(
        '.api-type-definition[data-layer="1"] .api-type-reference',
      ),
    ).find((button) => button.textContent === 'FirstConfig')!
    firstReference.click()
    await flushPromises()

    const secondReference = Array.from(
      document.body.querySelectorAll<HTMLButtonElement>(
        '.api-type-definition[data-layer="1"] .api-type-reference',
      ),
    ).find((button) => button.textContent === 'SecondConfig')!
    secondReference.click()
    await flushPromises()

    const layers = document.body.querySelectorAll('.api-type-definition')
    expect(layers).toHaveLength(2)
    expect(layers[0].textContent).toContain('RootConfig')
    expect(layers[1].textContent).toContain('SecondConfig')
    expect(layers[1].textContent).not.toContain('FirstConfig')

    wrapper.unmount()
  })

  it('prevents cyclic paths from opening duplicate layers', async () => {
    const cyclicDefinitions = {
      RecursiveA: {
        name: 'RecursiveA',
        declaration: 'export interface RecursiveA { next?: RecursiveB }',
        source: 'recursive.ts',
        references: ['RecursiveB'],
      },
      RecursiveB: {
        name: 'RecursiveB',
        declaration: 'export interface RecursiveB { previous?: RecursiveA }',
        source: 'recursive.ts',
        references: ['RecursiveA'],
      },
    }
    const wrapper = mount(ApiTypeDetails, {
      attachTo: document.body,
      props: {
        type: 'RecursiveA',
        definitions: cyclicDefinitions,
        labels,
      },
    })

    await wrapper.get('.api-type-reference').trigger('click')
    await flushPromises()
    document.body
      .querySelector<HTMLButtonElement>(
        '.api-type-definition[data-layer="1"] .api-type-reference',
      )!
      .click()
    await flushPromises()

    const cycle = document.body.querySelector<HTMLButtonElement>(
      '.api-type-definition[data-layer="2"] .api-type-reference',
    )!
    expect(cycle.disabled).toBe(true)
    cycle.click()
    await flushPromises()
    expect(document.body.querySelectorAll('.api-type-definition')).toHaveLength(
      2,
    )

    wrapper.unmount()
  })

  it('closes the complete stack on Escape and restores the root trigger focus', async () => {
    const wrapper = mount(ApiTypeDetails, {
      attachTo: document.body,
      props: {
        type: 'Boolean | TableClipboardConfig',
        definitions,
        labels,
      },
    })
    const rootTrigger = wrapper.get<HTMLButtonElement>('.api-type-reference')
    rootTrigger.element.focus()
    await rootTrigger.trigger('click')
    await flushPromises()
    document.body
      .querySelector<HTMLButtonElement>(
        '.api-type-definition .api-type-reference',
      )!
      .click()
    await flushPromises()

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await flushPromises()

    expect(document.body.querySelectorAll('.api-type-definition')).toHaveLength(
      0,
    )
    expect(document.activeElement).toBe(rootTrigger.element)

    wrapper.unmount()
  })
})
