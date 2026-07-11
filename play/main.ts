import { createApp, type Component } from 'vue'
import '@vuesax-alpha/theme-chalk/src/dark/css-vars.scss'
import '@vuesax-alpha/theme-chalk/src/loading.scss'
import './src/play-base.scss'
import { createRouter, createWebHashHistory } from 'vue-router'
;(async () => {
  const apps = import.meta.glob('./src/*.vue')
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
  let pathname = location.pathname
  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length)
  }
  const name = pathname.replace(/^\//, '') || 'App'
  const file = apps[`./src/${name}.vue`]
  if (!file) {
    location.pathname = 'App'
    return
  }
  const router = createRouter({
    routes: [
      {
        path: '',
        component: apps,
      },
    ],
    history: createWebHashHistory(),
  })
  const { default: App } = (await file()) as { default: Component }
  const app = createApp(App).use(router)

  app.mount('#play')
})()
