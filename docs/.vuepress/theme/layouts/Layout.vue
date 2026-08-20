<template>
  <s-config-provider :locale="componentLocale">
    <div
      id="sax-app"
      class="theme-container"
      :class="pageClasses"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <transition name="fade-code">
        <div
          v-if="codesandbox.url"
          class="con-codesandbox"
          @click="handleClickCodeSandbox"
        >
          <div class="con-iframe">
            <iframe
              :src="codesandbox.url"
              style="
                width: 100%;
                height: 500px;
                border: 0;
                border-radius: 4px;
                overflow: hidden;
              "
              title="vuesax-buttons-default"
              allow="
                geolocation;
                microphone;
                camera;
                midi;
                vr;
                accelerometer;
                gyroscope;
                payment;
                ambient-light-sensor;
                encrypted-media;
                usb;
              "
              sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </transition>

      <HeaderNotification v-if="shouldShowSidebar" />

      <ClientOnly>
        <Navbar
          v-if="shouldShowNavbar"
          v-show="!pageFrontmatter.navbar"
          :class="{
            transparent: pageFrontmatter.branding,
            isSidebarOpen: isSidebarOpen,
          }"
          @toggle-sidebar="toggleSidebar"
        />
      </ClientOnly>

      <div class="sidebar-mask" @click="toggleSidebar(false)" />

      <HomeModern v-if="pageFrontmatter.home" />

      <DocsHome
        v-else-if="pageFrontmatter.docsHome"
        :sidebar-items="sidebarItems"
      />

      <License v-else-if="pageFrontmatter.license" />

      <Branding v-else-if="pageFrontmatter.branding" />

      <NavbarLayout v-else-if="pageFrontmatter.navbar" />

      <s-layout
        v-else
        class="docs-layout"
        aside-width="260px"
        :gap="0"
        :padding="0"
        min-height="100dvh"
        :responsive="false"
      >
        <template v-if="shouldShowSidebar" #aside>
          <Sidebar class="docs-layout__sidebar" :sidebar="sidebarItems">
            <template #top>
              <slot name="sidebar-top" />
            </template>
            <template #bottom>
              <slot name="sidebar-bottom" />
            </template>
          </Sidebar>
        </template>

        <template v-if="shouldShowSidebar" #aside-outside>
          <ClientOnly>
            <Config attached class="docs-layout__config" />
          </ClientOnly>
        </template>

        <Page :sidebar-items="sidebarItems">
          <template #top>
            <slot name="page-top" />
          </template>
          <template #bottom>
            <slot name="page-bottom" />
          </template>
        </Page>
      </s-layout>

      <Sidebar
        v-if="!isStandardPage && shouldShowSidebar"
        :sidebar="sidebarItems"
      >
        <template #top>
          <slot name="sidebar-top" />
        </template>
        <template #bottom>
          <slot name="sidebar-bottom" />
        </template>
      </Sidebar>

      <ClientOnly>
        <Config v-if="!isStandardPage && shouldShowSidebar" />
      </ClientOnly>
    </div>
  </s-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { en, zhCn } from '@vuesax-alpha/locale'
import {
  usePageData,
  usePageFrontmatter,
  useRouteLocale,
} from '@vuepress/client'
import {
  useThemeData,
  useThemeLocaleData,
  // @ts-ignore
} from '@vuepress/plugin-theme-data/client'
import { resolveSidebarItems } from '../util'

import HomeModern from '../components/HomeModern.vue'
import Navbar from '../components/Navbar.vue'
import Page from '../components/Page.vue'
import DocsHome from '../components/DocsHome.vue'
import Config from '../components/Config.vue'
import License from '../components/License.vue'
import Sidebar from '../components/Sidebar.vue'
import HeaderNotification from '../components/HeaderNotification.vue'
import Branding from '../components/Branding.vue'
import NavbarLayout from './NavbarLayout.vue'
import type { LayoutFrontmatter } from '../shared/frontmatter/layout'
import type { SaxDesignVueThemeOptions } from '../saxDesignVueTheme'
import type { codesandboxContext } from '../type'

const router = useRouter()

const pageData = usePageData()
const pageFrontmatter = usePageFrontmatter<LayoutFrontmatter>()

const themeData = useThemeData<SaxDesignVueThemeOptions>()
const themeLocaleData = useThemeLocaleData<SaxDesignVueThemeOptions>()
const routeLocale = useRouteLocale()
const componentLocale = computed(() =>
  routeLocale.value.startsWith('/zh') ? zhCn : en,
)

const isSidebarOpen = ref<boolean>(false)
const codesandbox = ref<codesandboxContext>({})
let touchStart = reactive<{ x: number; y: number }>({
  x: Number.NaN,
  y: Number.NaN,
})

const shouldShowNavbar = computed(() => {
  const { logo, repo, navbar } = themeData.value
  const { frontmatter } = pageData.value
  if (frontmatter.navbar === false || navbar === false) {
    return false
  }
  return logo || repo || navbar || themeLocaleData.value?.navbar
})

const shouldShowSidebar = computed(() => {
  const { frontmatter } = pageData.value
  return (
    !frontmatter.home &&
    frontmatter.sidebar !== false &&
    sidebarItems.value?.length &&
    frontmatter.layout !== 'Layout'
  )
})

const isStandardPage = computed(
  () =>
    !pageFrontmatter.value.home &&
    !pageFrontmatter.value.docsHome &&
    !pageFrontmatter.value.license &&
    !pageFrontmatter.value.branding &&
    !pageFrontmatter.value.navbar,
)

const sidebarItems = computed(() => {
  return resolveSidebarItems(pageData.value, themeData.value, routeLocale.value)
})

const pageClasses = computed(() => {
  const userPageClass = pageFrontmatter.value?.pageClass
  return [
    {
      'no-navbar': !shouldShowNavbar.value,
      'sidebar-open': isSidebarOpen.value,
      'no-sidebar': !shouldShowSidebar.value,
    },
    userPageClass,
  ]
})

onMounted(() => {
  router?.afterEach(() => {
    isSidebarOpen.value = false
  })
})

const handleClickCodeSandbox = () => {
  document.body.style.overflow = ''
  codesandbox.value.url = undefined
}

const toggleSidebar = (to?: boolean) => {
  isSidebarOpen.value = typeof to === 'boolean' ? to : !isSidebarOpen.value
}

// side swipe
const onTouchStart = (e: TouchEvent) => {
  touchStart = {
    x: e.changedTouches[0].clientX,
    y: e.changedTouches[0].clientY,
  }
}

const onTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchStart.x
  const dy = e.changedTouches[0].clientY - touchStart.y
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx > 0 && touchStart.x <= 80) {
      toggleSidebar(true)
    } else {
      toggleSidebar(false)
    }
  }
}
</script>

<style lang="scss">
.fade-code-enter-active,
.fade-code-leave-active {
  transition: opacity 0.5s;
}

.fade-code-enter-from,
.fade-code-leave-to {
  opacity: 0;
}

.dark1 {
  .con-codesandbox {
    background: rgba(0, 0, 0, 0.7);
  }
}
.con-codesandbox {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1200;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  .con-iframe {
    max-width: 1200px;
    width: 100%;
  }
}

.docs-layout {
  min-width: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.docs-layout > .s-layout__content {
  gap: 0;
}

.docs-layout > .s-layout__content > .s-layout-aside {
  --s-layout-aside-outside-surface: rgba(var(--sax-theme-layout), 0.9);

  position: fixed;
  z-index: 1100;
  top: 57px;
  bottom: 0;
  left: 0;
  width: 260px !important;
  min-width: 260px;
  padding: 0;
  overflow: visible;
  border-radius: 0;
  background: rgba(var(--sax-theme-layout), 0.9);
  box-shadow: 10px 0 28px rgba(30, 27, 75, 0.07);
  backdrop-filter: blur(12px);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.docs-layout > .s-layout__content > .s-layout-aside > .s-layout-aside__content {
  height: 100%;
}

.docs-layout > .s-layout__content > .s-layout-body {
  width: calc(100% - 260px);
  margin-left: 260px;
  padding: 0;
  overflow: visible;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.docs-layout .docs-layout__sidebar {
  position: static;
  width: 100%;
  height: 100%;
  padding: 0 5px 0 0;
  overflow: hidden !important;
  transform: none !important;
  background: transparent;
  backdrop-filter: none;
}

.docs-layout .docs-layout__sidebar > .content-sidebar {
  height: 100%;
  padding-bottom: 64px;
}

.docs-layout .page {
  width: 100%;
  margin-left: 0;
}

.header-notification ~ .navbar:not(.fixed) ~ .docs-layout {
  .page {
    margin-top: 97px;
  }

  > .s-layout__content > .s-layout-aside {
    top: 97px;
  }
}

.hidden-sidebar .docs-layout > .s-layout__content > .s-layout-aside {
  transform: translateX(-100%) !important;
}

.hidden-sidebar .docs-layout > .s-layout__content > .s-layout-body {
  width: 100%;
  margin-left: 0;
}

.dark .docs-layout > .s-layout__content > .s-layout-aside {
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.24);
}

@media (max-width: 1080px) {
  .docs-layout > .s-layout__content > .s-layout-aside {
    top: 0;
    width: 213px !important;
    min-width: 213px;
    padding-top: 20px;
    transform: translateX(-100%);
  }

  .docs-layout > .s-layout__content > .s-layout-body {
    width: 100%;
    margin-left: 0;
  }

  .theme-container.sidebar-open
    .docs-layout
    > .s-layout__content
    > .s-layout-aside {
    transform: translateX(0);
  }

  .header-notification ~ .navbar:not(.fixed) ~ .docs-layout {
    > .s-layout__content > .s-layout-aside {
      top: 0;
    }
  }
}
</style>
