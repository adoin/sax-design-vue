import { defineClientConfig } from '@vuepress/client'

import Vuesax from 'vuesax-alpha'
import '@vuesax-alpha/theme-chalk/src/index.scss'
import '@vuesax-alpha/theme-chalk/src/dark/css-vars.scss'

import * as VuesaxIconsVue from '@vuesax-alpha/icons-vue'

const siteBase = import.meta.env.BASE_URL || '/'

const withSiteBase = (value: string) => {
  if (siteBase === '/' || !value.startsWith('/') || value.startsWith('//')) {
    return value
  }
  return value.startsWith(siteBase)
    ? value
    : `${siteBase.replace(/\/$/, '')}${value}`
}

const rewriteRootUrls = () => {
  if (typeof document === 'undefined' || siteBase === '/') return

  document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((el) => {
    el.setAttribute('href', withSiteBase(el.getAttribute('href') || ''))
  })
  document.querySelectorAll<HTMLImageElement>('img[src^="/"]').forEach((el) => {
    el.setAttribute('src', withSiteBase(el.getAttribute('src') || ''))
  })
  document
    .querySelectorAll<HTMLLinkElement>('link[href^="/"]')
    .forEach((el) => {
      el.setAttribute('href', withSiteBase(el.getAttribute('href') || ''))
    })
}

export default defineClientConfig({
  enhance({ app }) {
    // @ts-expect-error
    app.use(Vuesax)

    for (const [key, component] of Object.entries(VuesaxIconsVue)) {
      app.component(`VsIcon${key}`, component)
    }
  },
  setup() {
    if (typeof window === 'undefined' || siteBase === '/') return

    window.addEventListener('DOMContentLoaded', rewriteRootUrls, { once: true })
    window.addEventListener('load', rewriteRootUrls, { once: true })

    const observer = new MutationObserver(rewriteRootUrls)
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
  },
  rootComponents: [],
})
