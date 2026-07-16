import { computed } from 'vue'
import { usePageLang, useRouteLocale } from '@vuepress/client'

export type DocLocale = 'en' | 'zh'

export function useDocLocale() {
  const pageLang = usePageLang()
  const routeLocale = useRouteLocale()

  const locale = computed<DocLocale>(() =>
    pageLang.value === 'zh-CN' ? 'zh' : 'en'
  )

  const localePath = computed(() => routeLocale.value)

  const withLocalePath = (path: string) => {
    const normalized = path.startsWith('/') ? path.slice(1) : path
    return `${routeLocale.value}${normalized}`
  }

  return { locale, localePath, withLocalePath }
}

const ui = {
  en: {
    newComponentBadge: 'New component',
    apiTables: {
      PROPS: 'PROPS',
      SLOTS: 'SLOTS',
      events: 'EVENTS',
      exposes: 'EXPOSES',
    },
    apiColumns: {
      property: 'Property',
      type: 'Type',
      values: 'Values',
      description: 'Description',
      default: 'default',
      example: 'Example',
      more: 'More',
      usage: 'Usage',
      open: 'Open',
      close: 'Close',
    },
    homeEyebrow: 'Vue 3 · TypeScript · Vite 8',
    homeGetStarted: 'Get Started',
    homeComponents: 'Components',
    homePlayground: 'Playground',
    highlightUsageTitle: 'Usage first',
    highlightUsageDesc:
      'Install with pnpm, register globally or on-demand, and ship with dark mode CSS variables out of the box.',
    highlightUsageAction: 'Getting started',
    highlightComponentsTitle: 'Components & config',
    highlightComponentsDesc:
      'Browse every component with props tables, copy-ready snippets, and configuration patterns for real projects.',
    highlightComponentsAction: 'Browse components',
    highlightPlaygroundTitle: 'Online playground',
    highlightPlaygroundDesc:
      'Open interactive demos in the browser — switch components instantly and validate styles before integrating.',
    highlightPlaygroundAction: 'Open playground',
    notFound: 'Take me home.',
    docsWarnPlayground: 'online playground',
  },
  zh: {
    newComponentBadge: '新组件',
    apiTables: {
      PROPS: '属性',
      SLOTS: '插槽',
      events: '事件',
      exposes: '暴露',
    },
    apiColumns: {
      property: '属性名',
      type: '类型',
      values: '可选值',
      description: '说明',
      default: '默认值',
      example: '示例',
      more: '更多',
      usage: '用法',
      open: '展开',
      close: '收起',
    },
    homeEyebrow: 'Vue 3 · TypeScript · Vite 8',
    homeGetStarted: '快速开始',
    homeComponents: '组件',
    homePlayground: 'Playground',
    highlightUsageTitle: '用法优先',
    highlightUsageDesc:
      '使用 pnpm 安装，支持全局或按需注册，内置暗色模式 CSS 变量，开箱即用。',
    highlightUsageAction: '快速开始',
    highlightComponentsTitle: '组件与配置',
    highlightComponentsDesc:
      '浏览全部组件：属性表、可复制示例，以及适用于真实项目的配置模式。',
    highlightComponentsAction: '浏览组件',
    highlightPlaygroundTitle: '在线 Playground',
    highlightPlaygroundDesc:
      '在浏览器中打开交互示例，即时切换组件并在集成前验证样式。',
    highlightPlaygroundAction: '打开 Playground',
    notFound: '返回首页',
    docsWarnPlayground: '在线 Playground',
  },
} as const

export function useDocLocaleUi() {
  const { locale, withLocalePath } = useDocLocale()
  const t = computed(() => ui[locale.value])
  return { t, locale, withLocalePath }
}
