<template>
  <main class="home-modern" aria-labelledby="home-title">
    <section class="home-modern__hero">
      <p class="home-modern__eyebrow">Vue 3 · TypeScript · Vite 8</p>
      <h1 id="home-title">{{ heroTitle }}</h1>
      <p class="home-modern__lead" v-html="heroDescription" />

      <div class="home-modern__cta">
        <router-link
          class="home-modern__btn home-modern__btn--primary"
          to="/guide/getting-started/"
        >
          Get Started
        </router-link>
        <router-link class="home-modern__btn" to="/components/">
          Components
        </router-link>
        <router-link class="home-modern__btn" to="/guide/playground">
          Playground
        </router-link>
      </div>
    </section>

    <section class="home-modern__grid">
      <article
        v-for="item in highlights"
        :key="item.title"
        class="home-modern__card"
      >
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <router-link
          v-if="item.link"
          :to="item.link"
          class="home-modern__card-link"
        >
          {{ item.action }} →
        </router-link>
      </article>
    </section>

    <section class="home-modern__tribute">
      <div>
        <p class="home-modern__tribute-label">Design heritage</p>
        <h2>Standing on the shoulders of Vuesax</h2>
        <p>
          Sax Design Vue continues the visual language pioneered by
          <a
            href="https://github.com/lusaxweb/vuesax"
            target="_blank"
            rel="noopener"
            >lusaxweb/vuesax</a
          >. We are grateful for the original design philosophy — expressive,
          distinctive, and free from rigid design systems.
        </p>
      </div>
      <router-link class="home-modern__btn" to="/guide/tribute">
        Read tribute
      </router-link>
    </section>

    <Footer />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import Footer from './Footer.vue'
import type { VsThemeProjectHomePageFrontmatter } from '../shared/frontmatter/home'

const pageFrontmatter = usePageFrontmatter<VsThemeProjectHomePageFrontmatter>()

const heroTitle = computed(
  () =>
    pageFrontmatter.value.heroText?.replace(/<[^>]+>/g, '') || 'Sax Design Vue'
)
const heroDescription = computed(
  () =>
    pageFrontmatter.value.description ||
    'A modern Vue 3 component library focused on practical usage, clear configuration, and live examples.'
)

const highlights = [
  {
    title: 'Usage first',
    description:
      'Install with pnpm, register globally or on-demand, and ship with dark mode CSS variables out of the box.',
    action: 'Getting started',
    link: '/guide/getting-started/',
  },
  {
    title: 'Components & config',
    description:
      'Browse every component with props tables, copy-ready snippets, and configuration patterns for real projects.',
    action: 'Browse components',
    link: '/components/',
  },
  {
    title: 'Online playground',
    description:
      'Open interactive demos in the browser — switch components instantly and validate styles before integrating.',
    action: 'Open playground',
    link: '/guide/playground',
  },
]
</script>

<style lang="scss" scoped>
.home-modern {
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.home-modern__hero {
  text-align: center;
  padding: 48px 0 56px;
}

.home-modern__eyebrow {
  margin: 0 0 12px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--vs-accent-color));
}

.home-modern__hero h1 {
  margin: 0 0 16px;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  line-height: 1.1;
  font-weight: 700;
  color: rgb(var(--vs-theme-color));
}

.home-modern__lead {
  max-width: 720px;
  margin: 0 auto 28px;
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(var(--vs-theme-color), 0.72);
}

.home-modern__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.home-modern__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid rgba(var(--vs-theme-color), 0.12);
  background: rgba(var(--vs-theme-layout), 0.9);
  color: rgb(var(--vs-theme-color));
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(var(--vs-accent-color), 0.35);
    color: rgb(var(--vs-accent-color));
  }

  &--primary {
    border-color: transparent;
    background: rgb(var(--vs-accent-color));
    color: #fff;

    &:hover {
      color: #fff;
      filter: brightness(1.05);
    }
  }
}

.home-modern__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.home-modern__card {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(var(--vs-theme-color), 0.08);
  background: rgba(var(--vs-theme-layout), 0.75);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.04);

  h2 {
    margin: 0 0 10px;
    font-size: 1.15rem;
    color: rgb(var(--vs-theme-color));
  }

  p {
    margin: 0 0 16px;
    line-height: 1.6;
    color: rgba(var(--vs-theme-color), 0.7);
  }
}

.home-modern__card-link {
  font-weight: 600;
  color: rgb(var(--vs-accent-color));
  text-decoration: none;
}

.home-modern__tribute {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 28px;
  margin-bottom: 48px;
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    rgba(var(--vs-accent-color), 0.12),
    rgba(var(--vs-theme-layout), 0.95)
  );
  border: 1px solid rgba(var(--vs-accent-color), 0.15);

  h2 {
    margin: 0 0 8px;
    font-size: 1.35rem;
    color: rgb(var(--vs-theme-color));
  }

  p {
    margin: 0;
    max-width: 640px;
    line-height: 1.7;
    color: rgba(var(--vs-theme-color), 0.75);

    a {
      color: rgb(var(--vs-accent-color));
      font-weight: 600;
    }
  }
}

.home-modern__tribute-label {
  margin: 0 0 6px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgb(var(--vs-accent-color));
}

@media (max-width: 720px) {
  .home-modern {
    padding-top: 24px;
  }

  .home-modern__tribute {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
