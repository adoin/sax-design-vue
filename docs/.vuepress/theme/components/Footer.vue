<template>
  <footer class="footer">
    <div class="footer__uls">
      <ul v-for="(link, index) in links" :key="index">
        <li class="title">
          {{ link.title }}
        </li>
        <li v-for="(item, i) in link.items" :key="i">
          <component
            :is="item.external ? 'a' : 'router-link'"
            :to="item.external ? undefined : item.link"
            :href="item.external ? item.link : undefined"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener' : undefined"
          >
            {{ item.text }}
          </component>
        </li>
      </ul>
    </div>

    <div class="copy">
      <span class="span-copy"
        >© {{ year }} Sax Design Vue · {{ t.footer.library }}</span
      >
      <span class="span-heritage">
        {{ t.footer.inspiredBy }}
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/lusaxweb/vuesax"
          >Vuesax</a
        >
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// @ts-ignore
import { useThemeData } from '@vuepress/plugin-theme-data/client'
import { useDocLocaleUi } from '../composables/docLocale'
import type { SaxDesignVueThemeOptions } from '~/saxDesignVueTheme'

const themeData = useThemeData<SaxDesignVueThemeOptions>()
const { t, withLocalePath } = useDocLocaleUi()
const year = new Date().getFullYear()

const links = computed(() => [
  {
    title: t.value.footer.documentation,
    items: [
      {
        text: t.value.footer.gettingStarted,
        link: withLocalePath('guide/getting-started.html'),
      },
      {
        text: t.value.footer.usingComponents,
        link: withLocalePath('guide/using-components'),
      },
      {
        text: t.value.footer.configuration,
        link: withLocalePath('guide/configuration'),
      },
      {
        text: t.value.footer.playground,
        link: withLocalePath('guide/playground'),
      },
      {
        text: t.value.footer.components,
        link: withLocalePath('components/'),
      },
    ],
  },
  {
    title: t.value.footer.project,
    items: [
      { text: 'GitHub', link: themeData.value.docsRepo, external: true },
      {
        text: t.value.footer.issues,
        link: `${themeData.value.docsRepo}/issues`,
        external: true,
      },
      {
        text: t.value.footer.releases,
        link: `${themeData.value.docsRepo}/releases`,
        external: true,
      },
    ],
  },
])
</script>

<style lang="scss" scoped>
@use '../styles/use' as *;

.footer {
  width: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 0;
  border-top: 1px solid hsl(var(--sax-theme-color) / 0.08);

  .footer__uls {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .copy {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
    padding: 20px 24px;
    color: hsl(var(--sax-theme-color) / 0.65);

    a {
      color: hsl(var(--sax-accent-color));
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  ul {
    padding: 24px;
    list-style: none;
    margin: 16px 12px;
    min-width: 180px;

    .title {
      margin-bottom: 12px;
      font-size: 0.95rem;
      font-weight: 700;
      color: hsl(var(--sax-theme-color));
    }

    li a,
    li :deep(a) {
      font-size: 0.85rem;
      opacity: 0.72;
      transition: opacity 0.2s ease;
      font-weight: 500;
      padding: 4px 0;
      display: block;
      color: inherit;
      text-decoration: none;

      &:hover {
        opacity: 1;
        color: hsl(var(--sax-accent-color));
      }
    }
  }
}

@media (max-width: 600px) {
  .footer {
    padding-bottom: 80px !important;
  }
}
</style>
