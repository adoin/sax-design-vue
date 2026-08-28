import * as VueRouter from 'vue-router'
import { defineAsyncComponent } from 'vue'
import dayjs from 'dayjs'

import * as VuesaxHooks from '../packages/hooks/index'
import * as SaxDesignVue from '../packages/sax-design-vue/index'

import type { DemoRuntimeModules } from './compile-demo-sfc'

export const demoRuntimeModules: DemoRuntimeModules = {
  'vue-router': VueRouter,
  'sax-design-vue': SaxDesignVue,
  '@vuesax-alpha/hooks': VuesaxHooks,
  dayjs: { default: dayjs },
  './call.vue': {
    default: defineAsyncComponent(
      () => import('../docs/.vuepress/components/notification/call.vue'),
    ),
  },
  './cookie.vue': {
    default: defineAsyncComponent(
      () => import('../docs/.vuepress/components/notification/cookie.vue'),
    ),
  },
  './user.vue': {
    default: defineAsyncComponent(
      () => import('../docs/.vuepress/components/notification/user.vue'),
    ),
  },
}
