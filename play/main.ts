import { createApp, h, onMounted, shallowRef, type Component } from 'vue'
import Vuesax from 'vuesax-alpha'
import '@vuesax-alpha/theme-chalk/src/dark/css-vars.scss'
import '@vuesax-alpha/theme-chalk/src/loading.scss'
import './src/play-base.scss'

const demos = import.meta.glob('./src/*.vue')

function demoName(): string {
  return location.hash.replace(/^#\/?/, '') || 'App'
}

const Root = {
  setup() {
    const current = shallowRef<Component | null>(null)

    const load = async (name: string) => {
      const loader = demos[`./src/${name}.vue`]
      if (!loader) {
        if (name !== 'App') {
          location.hash = '#/App'
        }
        return
      }
      const mod = (await loader()) as { default: Component }
      current.value = mod.default
    }

    onMounted(() => {
      void load(demoName())
      window.addEventListener('hashchange', () => {
        void load(demoName())
      })
    })

    return () => (current.value ? h(current.value) : null)
  },
}

createApp(Root).use(Vuesax).mount('#play')
