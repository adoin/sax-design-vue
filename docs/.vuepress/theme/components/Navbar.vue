<template>
  <header ref="$el" class="navbar">
    <SidebarButton @toggle-sidebar="emits('toggle-sidebar')" />

    <router-link :to="homeLink" class="home-link" aria-label="Sax Design Vue">
      <img class="logo-nav" src="/sax-logo-mark.svg" alt="" />
    </router-link>

    <div
      class="links"
      :style="
        linksWrapMaxWidth
          ? {
              'max-width': linksWrapMaxWidth + 'px',
            }
          : {}
      "
    >
      <s-menu
        v-if="isHome"
        v-model="activeHomeNavigation"
        class="home-navigation"
        mode="horizontal"
        :options="homeNavigation"
        @select="navigateHome"
      />
      <NavLinks v-else class="can-hide" />
    </div>

    <div :class="{ 'remove-links': focused }" class="external-links-search">
      <router-link
        class="nav-playground"
        :to="withLocalePath('guide/playground')"
        :title="t.examples.playground"
      >
        {{ t.examples.playground }}
      </router-link>

      <LanguageSwitcher />

      <ThemeToggle />

      <div class="con-links">
        <a
          title="Github"
          target="_blank"
          :href="
            themeData.docsRepo || 'https://github.com/adoin/sax-design-vue'
          "
        >
          <s-icon name="bxl:github" />
        </a>
        <!-- <a
          title="Facebook"
          target="_blank"
          href="https://www.facebook.com/thinh.onichan"
        >
          <s-icon  name="bxl:facebook" />
        </a> -->
      </div>

      <SearchBox
        v-if="themeData.search !== false && frontmatter.search !== false"
        @focus="focused = true"
        @blur="focused = false"
        @show-suggestions="handleShowSuggestions"
      />
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import {
  usePageFrontmatter,
  usePageLang,
  useRouteLocale,
} from '@vuepress/client'
import { useRouter } from 'vue-router'

// @ts-ignore
import {
  useThemeData,
  useThemeLocaleData,
} from '@vuepress/plugin-theme-data/client'

import { useDocLocaleUi } from '../composables/docLocale'
import SidebarButton from './SidebarButton.vue'
import NavLinks from './NavLinks.vue'
import SearchBox from './SearchBox.vue'
import ThemeToggle from './ThemeToggle.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import type { SaxDesignVueThemeOptions } from '~/saxDesignVueTheme'

const emits = defineEmits<{
  (event: 'toggle-sidebar'): void
}>()

const frontmatter = usePageFrontmatter<{ home?: boolean; search?: boolean }>()
const themeData = useThemeData<SaxDesignVueThemeOptions>()
const themeLocaleData = useThemeLocaleData<SaxDesignVueThemeOptions>()
const router = useRouter()
const pageLang = usePageLang()
const routeLocale = useRouteLocale()
const { t, withLocalePath } = useDocLocaleUi()

const homeLink = computed(
  () => themeData.value.home || themeLocaleData.value?.home || '/',
)

const linksWrapMaxWidth = ref<number | null>(null)
const showSuggestions = ref<boolean>(false)
const focused = ref<boolean>(false)
const activeHomeNavigation = ref<string>()

const isHome = computed(() => Boolean(frontmatter.value.home))
const homeNavigation = computed(() => {
  const isZh = pageLang.value === 'zh-CN'
  const localize = (path: string) =>
    `${routeLocale.value}${path.replace(/^\//, '')}`
  return [
    { key: localize('/guide/getting-started/'), label: isZh ? '指南' : 'Docs' },
    { key: localize('/components/'), label: isZh ? '组件' : 'Components' },
    { key: localize('/guide/playground'), label: 'Playground' },
  ]
})

const navigateHome = (key: string | number) => router.push(String(key))

const $el = ref<HTMLElement>()

const css = (el: HTMLElement | undefined, property: string) => {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el?.ownerDocument.defaultView
  // null means not to return pseudo styles
  // @ts-ignore
  return win?.getComputedStyle(el)[property]
}

onMounted(() => {
  const MOBILE_DESKTOP_BREAKPOINT = 719 // refer to config.styl
  const NAVBAR_VERTICAL_PADDING =
    Number.parseInt(css($el.value, 'paddingLeft')) +
    Number.parseInt(css($el.value, 'paddingRight'))

  const handleLinksWrapWidth = () => {
    if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
      linksWrapMaxWidth.value = null
    } else {
      linksWrapMaxWidth.value =
        ($el.value?.offsetWidth || 0) - NAVBAR_VERTICAL_PADDING
    }
  }
  handleLinksWrapWidth()
  window.addEventListener('resize', handleLinksWrapWidth, false)

  window.addEventListener('scroll', () => {
    if ($el.value) {
      if (window.pageYOffset > 0) {
        $el.value.classList.add('fixed')
      } else {
        $el.value.classList.remove('fixed')
      }
    }
  })
})

const handleShowSuggestions = (active: boolean) => {
  showSuggestions.value = active
}
</script>

<style lang="scss">
@use '../styles/use' as *;

.home-link {
  position: absolute;
  left: 0px;
  display: flex !important;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  font-weight: 700;
  padding-left: 30px;

  .logo-nav {
    display: block;
    width: 26px;
    height: 26px;
  }

  &::before {
    content: 'Sax Design Vue';
    color: hsl(var(--sax-theme-color));
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.035em;
    white-space: nowrap;
  }
}
.nav-playground {
  padding: 10px;
  color: inherit;
  opacity: 0.72;
  transition: all 0.25s ease;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  &:hover {
    opacity: 1;
    color: hsl(var(--sax-accent-color));
  }
}
.external-links-search {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0px;
  .con-links {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    a {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      box-sizing: border-box;
    }
  }
}
.external-links-search.remove-links .con-links {
  display: none;
}
.navbar {
  padding: 0px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px 0px 30px 0px;
  transition: all 0.25s ease;
  &.transparent {
    background: transparent;
  }
  &.fixed {
    border-radius: 0px;
    background: -color('theme-layout');
  }
  .logo {
    height: $navbarHeight - 1.4rem;
    min-width: $navbarHeight - 1.4rem;
    margin-right: 0.8rem;
    vertical-align: top;
  }
  .site-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: -color('theme-color');
    position: relative;
  }
  .links {
    box-sizing: border-box;
    white-space: nowrap;
    font-size: 0.9rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .search-box {
      flex: 0 0 auto;
      vertical-align: top;
    }

    .home-navigation {
      width: auto;

      :deep(.s-menu__list) {
        display: flex !important;
        flex-direction: row !important;
        align-items: center;
        gap: 6px;
        margin: 0;
        padding: 5px;
      }

      :deep(.s-menu-node) {
        flex: 0 0 auto;
      }

      :deep(.s-menu-node__button) {
        width: auto !important;
        min-width: 0;
        min-height: 38px;
        border-radius: 12px;
        color: hsl(var(--sax-theme-color) / 0.68);
        font-weight: 600;
      }

      :deep(.s-menu-node.is-active .s-menu-node__button) {
        background: hsl(var(--sax-accent-color) / 0.1);
        color: hsl(var(--sax-accent-color));
      }
    }
  }
}
.navbar a,
.navbar span,
.navbar img {
  display: inline-block;
}

@media (max-width: 1500px) {
  .navbar {
    justify-content: flex-start;
  }
  .home-link {
    position: relative;
    padding-left: 0px;
    padding-right: 20px;
  }
}

@media (max-width: 1080px) {
  .navbar {
    padding: 9px;
    padding-top: 8px;
    padding-left: 2.5rem;
    display: flex;
    justify-content: space-between;
    .home-link {
      position: relative;
      padding-left: 0px;
      margin-left: 25px;
    }
    .external-links-search {
      position: relative;
      padding-left: 0px;
      right: 0px;
    }
    .can-hide {
      display: none;
    }
    .links {
      padding-left: 1.5rem;
      display: none;
    }
  }
}

@media (max-width: 500px) {
  .home-link {
    width: auto !important;
    padding: 0;
    margin-top: 0;

    &::before {
      font-size: 1rem;
    }
  }
}

@media (max-width: 390px) {
  .external-links-search {
    .con-links {
      display: none;
    }
  }
}
</style>
