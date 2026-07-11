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
        >© {{ year }} Sax Design Vue · Vue 3 component library</span
      >
      <span class="span-heritage">
        Design inspired by
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/lusaxweb/vuesax"
          >Vuesax</a
        >
        —
        <router-link to="/guide/tribute">tribute</router-link>
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
// @ts-ignore
import { useThemeData } from '@vuepress/plugin-theme-data/client'
import type { VuesaxAlphaThemeOptions } from '~/vuesaxAlphaTheme'

const themeData = useThemeData<VuesaxAlphaThemeOptions>()
const year = new Date().getFullYear()

const links = [
  {
    title: 'Documentation',
    items: [
      { text: 'Getting Started', link: '/guide/getting-started/' },
      { text: 'Using Components', link: '/guide/using-components' },
      { text: 'Configuration', link: '/guide/configuration' },
      { text: 'Playground', link: '/guide/playground' },
      { text: 'Components', link: '/components/' },
    ],
  },
  {
    title: 'Design heritage',
    items: [
      { text: 'Tribute to Vuesax', link: '/guide/tribute' },
      {
        text: 'Original Vuesax (Vue 2)',
        link: 'https://github.com/lusaxweb/vuesax',
        external: true,
      },
      { text: 'vuesax.com', link: 'https://vuesax.com/', external: true },
    ],
  },
  {
    title: 'Project',
    items: [
      { text: 'GitHub', link: themeData.value.docsRepo, external: true },
      {
        text: 'Issues',
        link: `${themeData.value.docsRepo}/issues`,
        external: true,
      },
      {
        text: 'Releases',
        link: `${themeData.value.docsRepo}/releases`,
        external: true,
      },
    ],
  },
]
</script>

<style lang="scss" scoped>
@import '../styles/use';

.footer {
  width: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 0;
  border-top: 1px solid rgba(var(--vs-theme-color), 0.08);

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
    color: rgba(var(--vs-theme-color), 0.65);

    a {
      color: rgb(var(--vs-accent-color));
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
      color: rgb(var(--vs-theme-color));
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
        color: rgb(var(--vs-accent-color));
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
