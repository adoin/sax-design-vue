import { createApp, nextTick } from 'vue'
import { STable } from '../../packages/components/table'
import { SButton } from '../../packages/components/button'
import { SCheckbox } from '../../packages/components/checkbox'
import { SInput } from '../../packages/components/input'
import { STag } from '../../packages/components/tag'
import '../../packages/theme-chalk/src/index.scss'
import '../../packages/theme-chalk/src/dark/css-vars.scss'
import type { ComponentInternalInstance } from 'vue'
import type { TableExposes } from '../../packages/components/table'

const examples = {
  details: () => import('../../docs/.vuepress/components/table/details.vue'),
  'details-source': () =>
    import('../../docs/.vuepress/components/table/details-source.vue'),
  'footer-data': () =>
    import('../../docs/.vuepress/components/table/footer-data.vue'),
  'footer-source': () =>
    import('../../docs/.vuepress/components/table/footer-source.vue'),
  'merging-source': () =>
    import('../../docs/.vuepress/components/table/merging-source.vue'),
  'grouping-source': () =>
    import('../../docs/.vuepress/components/table/grouping-source.vue'),
  grouping: () => import('../../docs/.vuepress/components/table/grouping.vue'),
  'grouped-source': () =>
    import('../../docs/.vuepress/components/table/grouped-source.vue'),
}
const root = document.querySelector<HTMLElement>('#fixture')!
let app: ReturnType<typeof createApp> | undefined
const settle = async () => {
  await nextTick()
  for (let frame = 0; frame < 4; frame++)
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}
const unmount = async () => {
  app?.unmount()
  app = undefined
  await settle()
}
const table = () => {
  const element = root.querySelector('.s-table') as Element & {
    __vueParentComponent?: ComponentInternalInstance
  }
  let component = element?.__vueParentComponent
  while (component && !component.exposed?.scrollToRow)
    component = component.parent ?? undefined
  if (!component) throw new Error('Table methods unavailable')
  return component.exposed as unknown as TableExposes
}
Object.assign(window, {
  tableLayoutAudit: {
    mount: async (
      name: keyof typeof examples,
      dark: boolean,
      width: number,
    ) => {
      await unmount()
      document.documentElement.classList.toggle('dark', dark)
      root.style.width = `${width}px`
      const example = await examples[name]()
      app = createApp(example.default)
      for (const component of [STable, SButton, SCheckbox, SInput, STag])
        app.use(component)
      app.mount(root)
      await settle()
    },
    unmount,
    settle,
    table,
  },
})
