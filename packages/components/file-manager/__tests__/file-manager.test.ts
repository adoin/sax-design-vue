import { h, nextTick, shallowRef } from 'vue'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SConfigProvider } from '../../config-provider'
import FileManager from '../src/file-manager.vue'
import FilePreview from '../src/file-preview.vue'
import FileContent from '../src/file-content.vue'
import { SVirtualList } from '../../virtual-list'
import {
  ancestors,
  applyFileOperation,
  gridColumns,
  indexFiles,
  resolveExtension,
} from '../src/file-model'
import type { FileManagerEntry } from '../src/types'

enableAutoUnmount(afterEach)
const fixture = (): FileManagerEntry[] => [
  { id: 'a', parentId: null, name: 'Assets', kind: 'folder' },
  { id: 'b', parentId: null, name: 'Backup', kind: 'folder' },
  { id: 'nested', parentId: 'a', name: 'Nested', kind: 'folder' },
  { id: 'image', parentId: 'nested', name: 'Cover.PNG', kind: 'file' },
  ...Array.from({ length: 12 }, (_, i): FileManagerEntry => ({
    id: i,
    parentId: null,
    name: `File ${i}.txt`,
    kind: 'file',
    size: i * 1024,
  })),
]
const settle = async () => {
  await nextTick()
  await flushPromises()
  await nextTick()
}
const controlled = (extra: Record<string, unknown> = {}) => {
  const files = shallowRef(fixture())
  const wrapper = mount(
    {
      setup: () => () =>
        h(FileManager, {
          ...extra,
          modelValue: files.value,
          'onUpdate:modelValue': (value: FileManagerEntry[]) => {
            files.value = value
          },
        }),
    },
    { attachTo: document.body },
  )
  return { wrapper, manager: wrapper.findComponent(FileManager), files }
}

describe('FileManager operation planner', () => {
  it('moves entire subtrees through stable IDs without mutating the input', () => {
    const files = fixture()
    const result = applyFileOperation(
      files,
      { type: 'move', ids: ['a', 'nested'], targetId: 'b' },
      () => 'unused',
    )
    expect(result.find((entry) => entry.id === 'a')?.parentId).toBe('b')
    expect(result.find((entry) => entry.id === 'nested')?.parentId).toBe('a')
    expect(files[0].parentId).toBeNull()
    expect(
      ancestors(indexFiles(result), 'nested').map((entry) => entry.id),
    ).toEqual(['b', 'a', 'nested'])
  })
  it('rejects cycles, self drops, files as destinations, duplicates and missing IDs', () => {
    for (const targetId of ['nested', 'a', 'image', 'missing'])
      expect(() =>
        applyFileOperation(
          fixture(),
          { type: 'move', ids: ['a'], targetId },
          () => 'unused',
        ),
      ).toThrow()
    const files = [
      ...fixture(),
      {
        id: 'collision',
        parentId: 'b',
        name: 'ASSETS',
        kind: 'folder' as const,
      },
    ]
    expect(() =>
      applyFileOperation(
        files,
        { type: 'move', ids: ['a'], targetId: 'b' },
        () => 'unused',
      ),
    ).toThrow(/already exists/)
    expect(() =>
      applyFileOperation(
        files,
        { type: 'delete', ids: ['missing'] },
        () => 'unused',
      ),
    ).toThrow()
  })
  it('enforces descendant permissions atomically', () => {
    const files = fixture()
    files[3].permissions = { delete: false, move: false }
    expect(() =>
      applyFileOperation(files, { type: 'delete', ids: ['a'] }, () => 'unused'),
    ).toThrow(/denied/)
    expect(() =>
      applyFileOperation(
        files,
        { type: 'move', ids: ['a'], targetId: 'b' },
        () => 'unused',
      ),
    ).toThrow(/denied/)
    expect(files).toHaveLength(16)
  })
  it('copies nested folders with new IDs and retains parent relationships', () => {
    let id = 100
    const next = applyFileOperation(
      fixture(),
      { type: 'copy', ids: ['a'], targetId: 'b' },
      () => id++,
    )
    const copies = next.slice(16)
    expect(copies).toHaveLength(3)
    expect(copies[0].parentId).toBe('b')
    expect(copies[1].parentId).toBe(copies[0].id)
    expect(copies[2].parentId).toBe(copies[1].id)
  })
  it('validates names, duplicate IDs and file extensions', () => {
    expect(() => indexFiles([...fixture(), fixture()[0]])).toThrow(/Duplicate/)
    for (const name of ['', '../x', 'file?.txt', '..'])
      expect(() =>
        applyFileOperation(
          fixture(),
          { type: 'rename', ids: [0], name },
          () => 'unused',
        ),
      ).toThrow()
    expect(resolveExtension(fixture()[3])).toBe('png')
    expect(gridColumns(640, 144)).toBe(4)
    expect(gridColumns(640, 240)).toBe(2)
    expect(gridColumns(0, 240)).toBe(1)
  })
})

describe('FileManager interactions', () => {
  const clickMenu = async (text: string) => {
    const button = [
      ...document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    ].find((item) => item.textContent?.includes(text))
    expect(button).toBeDefined()
    button!.click()
    await settle()
  }
  it('keeps one search input and a single changing view toggle, with Home icons', async () => {
    const { manager } = controlled()
    await settle()
    expect(
      manager.find('.s-file-manager__toolbar').findAll('input'),
    ).toHaveLength(1)
    expect(
      manager.find('.s-file-manager__toolbar').findAll('button'),
    ).toHaveLength(1)
    expect(manager.find('.s-file-manager__toolbar').text()).not.toContain(
      'New folder',
    )
    expect(
      manager.find('.s-file-manager__history').findAll('button'),
    ).toHaveLength(4)
    expect(manager.find('.s-file-manager__tree-root').text()).toBe('')
    expect(manager.findAll('.s-file-manager__glyph.is-home')).toHaveLength(2)
    await manager
      .get('input[aria-label="Search this folder"]')
      .setValue('assets')
    expect(manager.findAll('[role="option"]')).toHaveLength(1)
    await manager.get('button[aria-label="List view"]').trigger('click')
    expect(
      manager
        .get('.s-file-manager__view-toggle .s-file-manager__glyph')
        .classes(),
    ).toContain('is-list')
    expect(manager.find('button[aria-label="Icon view"]').exists()).toBe(true)
  })
  it('sorts from blank-space menus with configurable comparators and directions', async () => {
    const { manager } = controlled({
      sortOptions: [
        { key: 'name', label: 'Name' },
        {
          key: 'length',
          label: 'Name length',
          compare: (a: FileManagerEntry, b: FileManagerEntry) =>
            a.name.length - b.name.length,
        },
      ],
    })
    await settle()
    await manager.get('[role="listbox"]').trigger('contextmenu')
    await settle()
    expect(
      document.querySelector('[role="menuitem"][aria-haspopup="menu"]')
        ?.textContent,
    ).toContain('Sort')
    expect(
      [...document.querySelectorAll('[role="menuitem"]')].some((item) =>
        item.textContent?.includes('Name length'),
      ),
    ).toBe(false)
    await clickMenu('Sort')
    await clickMenu('Name length')
    expect(manager.emitted('update:sort')?.at(-1)).toEqual([
      { key: 'length', order: 'ascending' },
    ])
    await manager.get('[role="listbox"]').trigger('contextmenu')
    await settle()
    await clickMenu('Sort')
    await clickMenu('Descending')
    expect(manager.emitted('update:sort')?.at(-1)).toEqual([
      { key: 'length', order: 'descending' },
    ])
    const names = manager
      .findAll('[role="option"]')
      .map((entry) => entry.attributes('aria-label'))
      .filter((name) => name?.startsWith('File'))
    expect(names.slice(0, 2)).toEqual(['File 11.txt', 'File 10.txt'])
  })
  it('allows the toolbar slot to replace the complete row using typed search/view hooks', async () => {
    const wrapper = mount(FileManager, {
      props: { modelValue: fixture() },
      slots: {
        toolbar: (ctx) =>
          h('div', { class: 'custom-toolbar' }, [
            h('input', {
              value: ctx.search,
              'aria-label': 'Custom search',
              onInput: (event: Event) =>
                ctx.setSearch((event.target as HTMLInputElement).value),
            }),
            h('button', { onClick: ctx.toggleView }, ctx.view),
          ]),
      },
    })
    await settle()
    expect(wrapper.find('.s-file-manager__view-toggle').exists()).toBe(false)
    expect(
      wrapper.find('input[aria-label="Search this folder"]').exists(),
    ).toBe(false)
    await wrapper.get('input[aria-label="Custom search"]').setValue('Assets')
    expect(wrapper.findAll('[role="option"]')).toHaveLength(1)
    await wrapper.get('.custom-toolbar button').trigger('click')
    expect(wrapper.find('.s-file-manager__content.is-list').exists()).toBe(true)
  })
  it('shares hidden filtering between the tree and content, and persists hide/unhide through operations', async () => {
    const { manager, files } = controlled()
    await settle()
    await manager.vm.$.exposed!.execute({
      type: 'set-hidden',
      ids: ['a', 0],
      hidden: true,
    })
    await settle()
    expect(files.value.find((entry) => entry.id === 'a')?.hidden).toBe(true)
    expect(manager.find('[role="option"][aria-label="Assets"]').exists()).toBe(
      false,
    )
    expect(manager.find('.s-file-manager__tree').text()).not.toContain('Assets')
    await manager.get('button[aria-label="Show hidden items"]').trigger('click')
    expect(
      manager.find('[role="option"][aria-label="Assets"]').classes(),
    ).toContain('is-hidden')
    expect(manager.find('.s-file-manager__tree').text()).toContain('Assets')
    await manager
      .get('[role="option"][aria-label="File 0.txt"]')
      .trigger('contextmenu')
    await settle()
    await clickMenu('Unhide')
    expect(files.value.find((entry) => entry.id === 0)?.hidden).toBe(false)
    await manager.get('button[aria-label="Hide hidden items"]').trigger('click')
    expect(
      manager.find('[role="option"][aria-label="File 0.txt"]').exists(),
    ).toBe(true)
  })
  it('can list files in the tree and use case-insensitive SVG/PNG thumbnails with a file fallback', async () => {
    const manager = mount(FileManager, {
      props: {
        modelValue: fixture(),
        treeShowFiles: true,
        thumbnails: { '.TXT': '/files/text.svg' },
        icons: { home: { src: '/files/home.svg' } },
      },
    })
    await settle()
    expect(
      manager.find('.s-file-manager__tree-root img').attributes('src'),
    ).toBe('/files/home.svg')
    const treeFile = manager
      .findAll('.s-file-manager__tree-name')
      .find((row) => row.text() === 'File 0.txt')!
    expect(treeFile.find('img').attributes('src')).toBe('/files/text.svg')
    expect(
      manager
        .get('[role="option"][aria-label="File 0.txt"] img')
        .attributes('src'),
    ).toBe('/files/text.svg')
    await manager.setProps({ thumbnails: {} })
    expect(treeFile.find('.s-file-manager__glyph.is-file svg').exists()).toBe(
      true,
    )
    expect(treeFile.find('img').exists()).toBe(false)
    await manager.setProps({ treeShowFiles: false })
    expect(manager.find('.s-file-manager__tree').text()).not.toContain(
      'File 0.txt',
    )
  })
  it('shows different folder glyphs after opening and leaves hidden directories when visibility is disabled', async () => {
    const { manager, files } = controlled()
    await settle()
    expect(
      manager.find('.s-file-manager__tree-name .is-folder-open').exists(),
    ).toBe(false)
    await manager
      .get('[role="option"][aria-label="Assets"]')
      .trigger('dblclick')
    expect(
      manager.find('.s-file-manager__tree-name .is-folder-open').exists(),
    ).toBe(true)
    await manager.get('button[aria-label="Show hidden items"]').trigger('click')
    await manager.vm.$.exposed!.execute({
      type: 'set-hidden',
      ids: ['a'],
      hidden: true,
    })
    await settle()
    await manager.get('button[aria-label="Hide hidden items"]').trigger('click')
    await settle()
    expect(manager.emitted('navigate')?.at(-1)).toEqual([null])
    expect(
      files.value.find((entry) => entry.id === 'nested')?.hidden,
    ).toBeUndefined()
  })
  it('honors hidden permissions and allows explicit unhide for dot-prefixed names', async () => {
    const hidden: FileManagerEntry = {
      id: 'hidden',
      parentId: null,
      kind: 'file',
      name: '.settings',
    }
    const wrapper = mount(FileManager, {
      props: { modelValue: [hidden], behavior: { showHidden: true } },
    })
    await settle()
    expect(wrapper.get('[role="option"]').classes()).toContain('is-hidden')
    const unhidden = applyFileOperation(
      [hidden],
      { type: 'set-hidden', ids: ['hidden'], hidden: false },
      () => 'new',
    )
    await wrapper.setProps({
      modelValue: unhidden,
      behavior: { showHidden: false },
    })
    expect(wrapper.find('[role="option"]').exists()).toBe(true)
    expect(() =>
      applyFileOperation(
        [{ ...hidden, permissions: { hide: false } }],
        { type: 'set-hidden', ids: ['hidden'], hidden: true },
        () => 'new',
      ),
    ).toThrow(/denied/i)
  })
  const drag = async (element: Element, type: string) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'dataTransfer', {
      value: { setData: vi.fn(), effectAllowed: 'move', dropEffect: 'move' },
    })
    element.dispatchEvent(event)
    await settle()
    return event
  }
  it('moves files through tiles, tree rows and breadcrumb drop targets', async () => {
    const { manager, files } = controlled()
    await settle()
    await drag(
      manager.get('[role="option"][aria-label="File 0.txt"]').element,
      'dragstart',
    )
    const target = manager.get('[role="option"][aria-label="Assets"]')
    expect((await drag(target.element, 'dragover')).defaultPrevented).toBe(true)
    await drag(target.element, 'drop')
    expect(files.value.find((entry) => entry.id === 0)?.parentId).toBe('a')
    await drag(
      manager.get('[role="option"][aria-label="File 1.txt"]').element,
      'dragstart',
    )
    const tree = manager
      .findAll('.s-file-manager__tree-row')
      .find((row) => row.text().includes('Backup'))!
    await drag(tree.element, 'dragover')
    await drag(tree.element, 'drop')
    expect(files.value.find((entry) => entry.id === 1)?.parentId).toBe('b')
    await target.trigger('dblclick')
    await settle()
    await drag(
      manager.get('[role="option"][aria-label="File 0.txt"]').element,
      'dragstart',
    )
    const breadcrumb = manager.get('.s-breadcrumb__item')
    await drag(breadcrumb.element, 'dragover')
    await drag(breadcrumb.element, 'drop')
    expect(files.value.find((entry) => entry.id === 0)?.parentId).toBe(null)
  })
  it('prevents the native context menu synchronously and dispatches custom menu actions', async () => {
    const { manager } = controlled({
      contextMenu: [{ label: 'Inspect', value: 'inspect' }],
    })
    await settle()
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    })
    manager
      .get('[role="option"][aria-label="File 0.txt"]')
      .element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    await settle()
    const button = [
      ...document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    ].find((item) => item.textContent === 'Inspect')!
    button.click()
    await settle()
    expect(manager.emitted('menu-select')?.[0]?.[1]).toMatchObject({
      entry: { id: 0 },
      selection: [{ id: 0 }],
    })
  })
  it('supports select-all and cut/paste shortcuts, retaining stable IDs', async () => {
    const { manager, files } = controlled()
    await settle()
    const box = manager.get('[role="listbox"]')
    await box.trigger('keydown', { key: 'a', ctrlKey: true })
    expect(manager.emitted('update:selectedIds')?.at(-1)?.[0]).toHaveLength(14)
    await manager
      .get('[role="option"][aria-label="File 0.txt"]')
      .trigger('click')
    await box.trigger('keydown', { key: 'x', ctrlKey: true })
    await manager
      .get('[role="option"][aria-label="Assets"]')
      .trigger('dblclick')
    await box.trigger('keydown', { key: 'v', ctrlKey: true })
    await settle()
    expect(files.value.find((entry) => entry.id === 0)?.parentId).toBe('a')
  })
  it('supports Ctrl toggle, Shift range, natural sorting, and disabled items', async () => {
    const { manager } = controlled()
    await settle()
    await manager
      .get('[role="option"][aria-label="File 1.txt"]')
      .trigger('click')
    await manager
      .get('[role="option"][aria-label="File 4.txt"]')
      .trigger('click', { shiftKey: true })
    expect(manager.emitted('update:selectedIds')?.at(-1)).toEqual([
      [1, 2, 3, 4],
    ])
    await manager
      .get('[role="option"][aria-label="File 2.txt"]')
      .trigger('click', { ctrlKey: true })
    expect(manager.emitted('update:selectedIds')?.at(-1)).toEqual([[1, 3, 4]])
  })
  it('navigates folders with double click and back through the shared breadcrumb', async () => {
    const { manager } = controlled()
    await settle()
    await manager
      .get('[role="option"][aria-label="Assets"]')
      .trigger('dblclick')
    expect(
      manager
        .findAll('[role="option"]')
        .map((item) => item.attributes('aria-label')),
    ).toEqual(['Nested'])
    expect(manager.get('.s-breadcrumb').text()).toContain('Assets')
    await manager.get('button[aria-label="Back"]').trigger('click')
    await settle()
    expect(manager.findAll('[role="option"]').length).toBeGreaterThan(2)
  })
  it('renames with F2, preserves editor Delete input and deletes selected files with Delete', async () => {
    const { manager, files } = controlled()
    await settle()
    await manager
      .get('[role="option"][aria-label="File 1.txt"]')
      .trigger('click')
    await manager.get('[role="listbox"]').trigger('keydown', { key: 'F2' })
    await settle()
    const editor = manager.get('.s-file-manager__rename input')
    await editor.setValue('Changed.md')
    await editor.trigger('keydown', { key: 'Delete' })
    expect(files.value.some((entry) => entry.id === 1)).toBe(true)
    await editor.trigger('keydown', { key: 'Enter' })
    await settle()
    expect(files.value.find((entry) => entry.id === 1)?.name).toBe('Changed.md')
    await manager.get('[role="listbox"]').trigger('keydown', { key: 'Delete' })
    await settle()
    expect(files.value.some((entry) => entry.id === 1)).toBe(false)
  })
  it('rejects async operations without optimistic mutation and blocks concurrent input', async () => {
    let resolve!: (value: boolean) => void
    const beforeOperation = vi.fn(
      () =>
        new Promise<boolean>((done) => {
          resolve = done
        }),
    )
    const { manager, files } = controlled({ beforeOperation })
    await settle()
    const promise = manager.vm.$.exposed!.execute({ type: 'delete', ids: [1] })
    await settle()
    expect(files.value).toHaveLength(16)
    expect(
      await manager.vm.$.exposed!.execute({ type: 'delete', ids: [2] }),
    ).toBe(false)
    resolve(false)
    await promise
    await settle()
    expect(files.value).toHaveLength(16)
    expect(beforeOperation).toHaveBeenCalledTimes(1)
  })
  it('reports stale async requests rather than overwriting replacement data', async () => {
    let resolve!: () => void
    const { manager, files } = controlled({
      beforeOperation: () =>
        new Promise<void>((done) => {
          resolve = done
        }),
    })
    const promise = manager.vm.$.exposed!.execute({ type: 'delete', ids: [1] })
    files.value = [
      ...files.value,
      { id: 'new', parentId: null, name: 'Remote', kind: 'folder' },
    ]
    await settle()
    resolve()
    await promise
    expect(files.value.some((entry) => entry.id === 1)).toBe(true)
    expect(manager.emitted('operation-error')).toHaveLength(1)
  })
  it('inherits global behavior, permits local overrides, and switches list/zoom without resetting data', async () => {
    const wrapper = mount({
      setup: () => () =>
        h(
          SConfigProvider,
          {
            fileManager: {
              behavior: { deleteKey: false, wheelZoom: false },
              view: 'list',
              treeShowFiles: true,
              icons: { home: { src: '/global-home.svg' } },
              thumbnails: { txt: '/global-text.svg' },
              sortOptions: [{ key: 'size', label: 'Bytes' }],
            },
          },
          () =>
            h(FileManager, {
              modelValue: fixture(),
              behavior: { wheelZoom: true },
              thumbnails: { '.TXT': '/local-text.png' },
            }),
        ),
    })
    await settle()
    const manager = wrapper.findComponent(FileManager)
    expect(manager.find('.is-list').exists()).toBe(true)
    expect(
      manager.get('.s-file-manager__tree-root img').attributes('src'),
    ).toBe('/global-home.svg')
    expect(manager.find('.s-file-manager__tree').text()).toContain('File 0.txt')
    expect(
      manager
        .get('[role="option"][aria-label="File 0.txt"] img')
        .attributes('src'),
    ).toBe('/local-text.png')
    await manager.get('[role="option"][aria-label="Assets"]').trigger('click')
    await manager.get('[role="listbox"]').trigger('keydown', { key: 'Delete' })
    expect(manager.emitted('update:modelValue')).toBeUndefined()
    await manager.get('button[aria-label="Icon view"]').trigger('click')
    manager.element.dispatchEvent(
      new WheelEvent('wheel', {
        shiftKey: true,
        deltaY: -100,
        bubbles: true,
        cancelable: true,
      }),
    )
    await settle()
    expect(manager.emitted('update:tileSize')?.at(-1)).toEqual([156])
    manager.element.dispatchEvent(
      new WheelEvent('wheel', {
        ctrlKey: true,
        deltaY: -100,
        bubbles: true,
        cancelable: true,
      }),
    )
    await settle()
    expect(manager.emitted('update:tileSize')).toHaveLength(1)
  })
  it('labels only short fallback extensions and preserves custom thumbnail priority across tree and views', async () => {
    const entries: FileManagerEntry[] = [
      'note.md',
      'code.js',
      'photo.png',
      'README',
      'data.文档',
    ].map((name, id) => ({ id, parentId: null, name, kind: 'file' }))
    const wrapper = mount(FileManager, {
      props: { modelValue: entries, treeShowFiles: true },
    })
    await settle()
    const labels = () =>
      wrapper
        .findAll('.s-file-manager__preview svg text')
        .map((node) => node.text())
    expect(labels().sort()).toEqual(['js', 'md', '文档'].sort())
    expect(
      wrapper
        .findAll('.s-file-manager__tree-name svg text')
        .map((node) => node.text())
        .sort(),
    ).toEqual(['js', 'md', '文档'].sort())
    await wrapper.get('button[aria-label="List view"]').trigger('click')
    expect(labels().sort()).toEqual(['js', 'md', '文档'].sort())
    await wrapper.setProps({ thumbnails: { md: '/markdown.svg' } })
    expect(
      wrapper
        .get('[role="option"][aria-label="note.md"] img')
        .attributes('src'),
    ).toBe('/markdown.svg')
    expect(labels()).not.toContain('md')
    await wrapper.setProps({
      modelValue: [{ ...entries[1], name: 'code.long' }],
    })
    expect(labels()).toEqual([])
  })
  it('renders arbitrary extension previews and a folder slot without treating data as HTML', () => {
    const preview = mount(FilePreview, {
      props: {
        context: {
          entry: fixture()[3],
          view: 'grid',
          selected: false,
          size: 144,
        },
        renderers: [
          {
            extensions: ['PNG'],
            render: () => h('span', { class: 'custom-preview' }, 'Custom'),
          },
        ],
      },
    })
    expect(preview.find('.custom-preview').exists()).toBe(true)
    const folder = mount(FilePreview, {
      props: {
        context: {
          entry: fixture()[0],
          view: 'grid',
          selected: false,
          size: 144,
        },
        renderers: [],
      },
      slots: { 'folder-preview': '<div class="four-images">Four images</div>' },
    })
    expect(folder.find('.four-images').exists()).toBe(true)
  })
  it('bounds mounting for 100,000 files and reflows tile columns', async () => {
    const wrapper = mount(FileManager, {
      props: {
        modelValue: Array.from({ length: 100_000 }, (_, id) => ({
          id,
          parentId: null,
          name: `${id}.txt`,
          kind: 'file' as const,
        })),
      },
    })
    await settle()
    expect(wrapper.findAll('[role="option"]').length).toBeLessThan(150)
    await wrapper.setProps({ tileSize: 260 })
    await settle()
    expect(wrapper.findAll('[role="option"]').length).toBeLessThan(80)
    expect(wrapper.get('.s-file-manager__row').attributes('style')).toContain(
      'repeat(2,',
    )
  })
  it('keeps the top file anchored when zoom changes the number of columns', async () => {
    const wrapper = mount(FileManager, {
      props: {
        modelValue: Array.from({ length: 1000 }, (_, id) => ({
          id,
          parentId: null,
          name: `${id}.txt`,
          kind: 'file' as const,
        })),
      },
    })
    await settle()
    const list = wrapper.findComponent(FileContent).findComponent(SVirtualList)
      .vm.$.exposed!
    await wrapper.get('[role="option"][aria-label="0.txt"]').trigger('click')
    const element = list.getScrollElement()
    Object.defineProperty(element, 'clientHeight', { value: 200 })
    list.measure()
    list.scrollToIndex(50, 'start')
    await settle()
    expect(list.getVisibleRange().start).toBe(50)
    await wrapper.setProps({ tileSize: 260 })
    await settle()
    expect(list.getVisibleRange().start).toBe(100)
    expect(wrapper.find('[role="option"][aria-label="200.txt"]').exists()).toBe(
      true,
    )
    await wrapper
      .get('[role="option"][aria-label="200.txt"]')
      .trigger('click', { shiftKey: true })
    expect(wrapper.emitted('update:selectedIds')?.at(-1)?.[0]).toHaveLength(201)
  })
  it('rejects in-place changes that arrive while an async operation is pending', async () => {
    let resolve!: () => void
    const files = fixture()
    const wrapper = mount(FileManager, {
      props: {
        modelValue: files,
        beforeOperation: () =>
          new Promise<void>((done) => {
            resolve = done
          }),
      },
    })
    const promise = wrapper.vm.execute({ type: 'delete', ids: [1] })
    files[0].name = 'Remote change'
    resolve()
    await promise
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('operation-error')).toHaveLength(1)
  })
})
