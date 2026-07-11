import {
  createApp,
  h,
  onMounted,
  ref,
  shallowRef,
  type Component,
  type VNode,
} from 'vue'
import Vuesax from 'vuesax-alpha'
import '@vuesax-alpha/theme-chalk/src/dark/css-vars.scss'
import '@vuesax-alpha/theme-chalk/src/loading.scss'
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

const Root = {
  setup() {
    const current = shallowRef<Component | null>(null)
    const activeName = ref('App')
    const source = ref('')

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
        }
      )
    }
  },
}

createApp(Root).use(Vuesax).mount('#play')
