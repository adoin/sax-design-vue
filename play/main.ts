import {
  createApp,
  h,
  onMounted,
  shallowRef,
  type Component,
  type VNode,
} from 'vue'
import '@vuesax-alpha/theme-chalk/src/dark/css-vars.scss'
import './src/play-base.scss'
import PlaygroundShell from './PlaygroundShell.vue'

const demos = import.meta.glob('./src/*.vue')
const sources = import.meta.glob('./src/*.vue', {
  query: '?raw',
  import: 'default',
})

function demoName(): string {
  return location.hash.replace(/^#\/?/, '') || 'App'
}

function isEmbedPreview(): boolean {
  return new URLSearchParams(location.search).get('embed') === 'preview'
}

function createEmbedPreviewRoot() {
  let compiler: Promise<typeof import('./compile-demo-sfc')> | undefined

  return {
    setup() {
      const current = shallowRef<Component | null>(null)
      const compileError = shallowRef<string | null>(null)
      const activeName = shallowRef(demoName())

      const compileFromSource = async (source: string) => {
        compiler ||= import('./compile-demo-sfc')
        const { compileDemoSfc } = await compiler
        const { component, error } = compileDemoSfc(source, activeName.value)
        compileError.value = error
        current.value = component
      }

      onMounted(() => {
        window.addEventListener('message', (event) => {
          if (event.data?.type !== 'sax-playground-source') return
          void compileFromSource(String(event.data.source || ''))
        })

        window.parent.postMessage({ type: 'sax-playground-ready' }, '*')
      })

      return (): VNode =>
        h(
          PlaygroundShell,
          {
            demoName: activeName.value,
            source: '',
            previewOnly: true,
            compileError: compileError.value,
          },
          {
            default: () => (current.value ? h(current.value) : null),
          },
        )
    },
  }
}

function createDefaultRoot() {
  return {
    setup() {
      const current = shallowRef<Component | null>(null)
      const activeName = shallowRef('App')
      const source = shallowRef('')

      const load = async (name: string) => {
        const loader = demos[`./src/${name}.vue`]
        const sourceLoader = sources[`./src/${name}.vue`]
        if (!loader) {
          if (name !== 'App') {
            location.hash = '#/App'
          }
          return
        }
        const mod = (await loader()) as { default: Component }
        current.value = mod.default
        activeName.value = name
        source.value = sourceLoader ? String(await sourceLoader()) : ''
      }

      onMounted(() => {
        void load(demoName())
        window.addEventListener('hashchange', () => {
          void load(demoName())
        })
      })

      return (): VNode | null => {
        if (!current.value) return null

        return h(
          PlaygroundShell,
          {
            demoName: activeName.value,
            source: source.value,
            isIndex: activeName.value === 'App',
          },
          {
            default: () => h(current.value as Component),
          },
        )
      }
    },
  }
}

async function bootstrap() {
  const embedPreview = isEmbedPreview()
  const Root = embedPreview ? createEmbedPreviewRoot() : createDefaultRoot()
  const app = createApp(Root)

  if (embedPreview) {
    const [{ default: SaxDesignVue }] = await Promise.all([
      import('sax-design-vue'),
      import('@vuesax-alpha/theme-chalk/src/index.scss'),
    ])
    app.use(SaxDesignVue)
  }

  app.mount('#play')
}

void bootstrap()
