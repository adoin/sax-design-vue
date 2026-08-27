import { defineClientConfig } from '@vuepress/client'

import SaxDesignVue, { ID_INJECTION_KEY } from 'sax-design-vue'
import '@vuesax-alpha/theme-chalk/src/index.scss'
import '@vuesax-alpha/theme-chalk/src/dark/css-vars.scss'

import 'virtual:sax-icons/register'

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
    app.provide(ID_INJECTION_KEY, {
      prefix: 1,
      current: 0,
    })
    // @ts-expect-error
    app.use(SaxDesignVue)
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
